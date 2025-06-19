"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Star,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  RefreshCw,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { Review, getAllReviews } from "@/lib/supabase/config";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

export default function AdminReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [publicationFilter, setPublicationFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estado para modal de edição
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({
    customer_name: "",
    car_model: "",
    rating: 1,
    comment: "",
  });

  // Carregar avaliações
  const loadReviews = async () => {
    setLoading(true);
    try {
      const allReviews = await getAllReviews();
      setReviews(allReviews);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      toast.error("Erro ao carregar avaliações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Função para aprovar/reprovar avaliação
  const handleApproval = async (reviewId: string, isApproved: boolean) => {
    try {
      const response = await fetch("/api/admin/reviews/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          isApproved,
        }),
      });

      if (response.ok) {
        toast.success(
          isApproved ? "Avaliação aprovada!" : "Avaliação reprovada!"
        );
        await loadReviews();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao atualizar avaliação.");
      }
    } catch (error) {
      console.error("Erro ao atualizar aprovação:", error);
      toast.error("Erro inesperado.");
    }
  };

  // Função para ativar/desativar avaliação
  const handleToggleActive = async (reviewId: string, isActive: boolean) => {
    try {
      const response = await fetch("/api/admin/reviews/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          isActive,
        }),
      });

      if (response.ok) {
        toast.success(
          isActive ? "Avaliação ativada!" : "Avaliação desativada!"
        );
        await loadReviews();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao atualizar avaliação.");
      }
    } catch (error) {
      console.error("Erro ao atualizar estado ativo:", error);
      toast.error("Erro inesperado.");
    }
  };

  // Função para abrir modal de edição
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      customer_name: review.customer_name,
      car_model: review.car_model,
      rating: review.rating,
      comment: review.comment || "",
    });
  };

  // Função para salvar edição
  const handleSaveEdit = async () => {
    if (!editingReview) return;

    if (editForm.comment.length > 50) {
      toast.error("O comentário não pode exceder 50 caracteres.");
      return;
    }

    try {
      const response = await fetch("/api/admin/reviews/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: editingReview.id,
          customerName: editForm.customer_name,
          carModel: editForm.car_model,
          rating: editForm.rating,
          comment: editForm.comment,
        }),
      });

      if (response.ok) {
        toast.success("Avaliação atualizada com sucesso!");
        setEditingReview(null);
        await loadReviews();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao atualizar avaliação.");
      }
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      toast.error("Erro inesperado.");
    }
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({
      customer_name: "",
      car_model: "",
      rating: 1,
      comment: "",
    });
  };

  // Filtrar avaliações
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.car_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && review.is_approved) ||
      (statusFilter === "pending" && !review.is_approved);

    const matchesPublication =
      publicationFilter === "all" ||
      (publicationFilter === "public" && review.allow_publication) ||
      (publicationFilter === "private" && !review.allow_publication);

    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;

    const matchesActive =
      statusFilter === "all" ||
      (statusFilter === "active" && review.is_active) ||
      (statusFilter === "inactive" && !review.is_active) ||
      statusFilter === "approved" ||
      statusFilter === "pending";

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPublication &&
      matchesRating &&
      matchesActive
    );
  });

  // Paginação
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Função para renderizar estrelas
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  // Função para obter badge de status
  const getStatusBadge = (review: Review) => {
    if (!review.is_active) {
      return <Badge variant="destructive">Inativa</Badge>;
    }
    if (review.is_approved) {
      return (
        <Badge variant="default" className="bg-green-600">
          Aprovada
        </Badge>
      );
    }
    return <Badge variant="secondary">Pendente</Badge>;
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: pt });
    } catch {
      return dateString;
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPublicationFilter("all");
    setRatingFilter("all");
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Gestão de Avaliações
          </div>
          <Button onClick={loadReviews} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="approved">Aprovadas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="inactive">Inativas</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={publicationFilter}
            onValueChange={setPublicationFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Publicação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="public">Autoriza Publicação</SelectItem>
              <SelectItem value="private">Não Autoriza</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Classificação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="5">5 Estrelas</SelectItem>
              <SelectItem value="4">4 Estrelas</SelectItem>
              <SelectItem value="3">3 Estrelas</SelectItem>
              <SelectItem value="2">2 Estrelas</SelectItem>
              <SelectItem value="1">1 Estrela</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={clearFilters} variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {reviews.length}
            </div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {reviews.filter((r) => r.is_approved && r.is_active).length}
            </div>
            <div className="text-sm text-green-600">Aprovadas</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {reviews.filter((r) => !r.is_approved && r.is_active).length}
            </div>
            <div className="text-sm text-yellow-600">Pendentes</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {
                reviews.filter(
                  (r) => r.allow_publication && r.is_approved && r.is_active
                ).length
              }
            </div>
            <div className="text-sm text-purple-600">Públicas</div>
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : paginatedReviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma avaliação encontrada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedReviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="space-y-4">
                  {/* Header com nome, veículo e status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg text-gray-900">
                          {review.customer_name}
                        </h4>
                        <span className="text-sm text-gray-600 font-medium">
                          {review.car_model}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(review)}
                      {review.allow_publication && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                        >
                          Autoriza Publicação
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Comentário */}
                  {review.comment && (
                    <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-200">
                      <p className="text-gray-700 italic text-sm">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>
                  )}

                  {/* Data e ações */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Criada em: {formatDate(review.created_at)}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      {!review.is_approved ? (
                        <Button
                          size="sm"
                          onClick={() => handleApproval(review.id, true)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(review.id, false)}
                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Remover Aprovação
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleToggleActive(review.id, !review.is_active)
                            }
                            className={
                              review.is_active
                                ? "border-red-300 text-red-700 hover:bg-red-50"
                                : "border-blue-300 text-blue-700 hover:bg-blue-50"
                            }
                          >
                            {review.is_active ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-1" />
                                Ocultar
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-1" />
                                Mostrar
                              </>
                            )}
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditReview(review)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(startIndex + itemsPerPage, filteredReviews.length)} de{" "}
              {filteredReviews.length} avaliações
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal de Edição */}
      <Dialog open={!!editingReview} onOpenChange={() => handleCancelEdit()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Avaliação</DialogTitle>
            <DialogDescription>
              Altere os dados da avaliação conforme necessário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Nome do Cliente */}
            <div className="space-y-2">
              <Label htmlFor="edit-customer-name">Nome do Cliente</Label>
              <Input
                id="edit-customer-name"
                value={editForm.customer_name}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    customer_name: e.target.value,
                  }))
                }
                placeholder="Nome do cliente"
              />
            </div>

            {/* Modelo do Carro */}
            <div className="space-y-2">
              <Label htmlFor="edit-car-model">Modelo do Carro</Label>
              <Input
                id="edit-car-model"
                value={editForm.car_model}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    car_model: e.target.value,
                  }))
                }
                placeholder="Modelo do carro"
              />
            </div>

            {/* Classificação */}
            <div className="space-y-2">
              <Label>Classificação</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({ ...prev, rating: star }))
                    }
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= editForm.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm">({editForm.rating}/5)</span>
              </div>
            </div>

            {/* Comentário */}
            <div className="space-y-2">
              <Label htmlFor="edit-comment">
                Comentário (máx. 50 caracteres)
              </Label>
              <Input
                id="edit-comment"
                value={editForm.comment}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Comentário da avaliação"
                maxLength={50}
              />
              <div className="text-xs text-muted-foreground text-right">
                {editForm.comment.length}/50
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancelEdit}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveEdit}>
              Guardar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
