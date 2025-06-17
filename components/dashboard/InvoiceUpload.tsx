"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";
import { Upload, FileText, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceUploadProps {
  bookingId: string;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export default function InvoiceUpload({
  bookingId,
  userId,
  open,
  onOpenChange,
  onUploadSuccess,
}: InvoiceUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é PDF
      if (file.type !== "application/pdf") {
        toast.error("Apenas ficheiros PDF são permitidos");
        return;
      }

      // Verificar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("O ficheiro não pode exceder 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione um ficheiro");
      return;
    }

    setUploading(true);

    try {
      // Gerar nome único para o ficheiro
      const timestamp = new Date().getTime();
      const fileName = `fatura_${bookingId}_${timestamp}.pdf`;
      const filePath = `faturas/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("invoices")
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Criar registo na base de dados
      const { error: dbError } = await supabase.from("invoices").insert([
        {
          booking_id: bookingId,
          user_id: userId,
          file_path: filePath,
          file_name: fileName,
        },
      ]);

      if (dbError) {
        // Se falhar a inserção na BD, remover o ficheiro do storage
        await supabase.storage.from("invoices").remove([filePath]);
        throw dbError;
      }

      // Enviar email de notificação de fatura emitida
      try {       
        // Obter token de autenticação do Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error("Não foi possível obter token de autenticação");
        }

        const emailResponse = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            type: "invoice_issued",
            data: {
              booking_id: bookingId,
              file_path: filePath,
            },
          }),
        });

        const emailResult = await emailResponse.json();
        
        if (!emailResponse.ok) {
          console.error("Erro na resposta do email:", emailResult);
          toast.error("Fatura enviada, mas falhou o envio do email de notificação");
        }
      } catch (emailError) {
        console.error("Erro ao enviar email de notificação:", emailError);
        toast.error("Fatura enviada, mas falhou o envio do email de notificação");
        // Não falhamos o upload por causa do email
      }

      toast.success("Fatura enviada com sucesso!");
      onUploadSuccess();
      onOpenChange(false);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar fatura");
    } finally {
      setUploading(false);
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setUploading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetDialog();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Anexar Fatura</DialogTitle>
          <DialogDescription>
            Faça upload da fatura em formato PDF para esta marcação.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label
              htmlFor="invoice-file"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Ficheiro PDF
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="invoice-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedFile ? (
                    <>
                      <FileText className="w-8 h-8 mb-2 text-primary" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Clique para fazer upload
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Apenas PDF (Máx. 10MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="invoice-file"
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />A enviar...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Enviar Fatura
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
