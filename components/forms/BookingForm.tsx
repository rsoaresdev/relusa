"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/config";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Car, MapPin, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useEmailService } from "@/lib/hooks/useEmailService";
import {
  validatePortugueseLicensePlate,
  formatLicensePlate,
  checkDateAvailability,
  checkMonthAvailability,
  TimeSlotAvailability,
} from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormProps {
  session: any;
  onCancel: () => void;
}

export default function BookingForm({ session, onCancel }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [licensePlateError, setLicensePlateError] = useState<string | null>(
    null
  );
  const [availability, setAvailability] = useState<TimeSlotAvailability | null>(
    null
  );
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    service_type: "complete",
    time_slot: "morning",
    custom_time: "",
    car_plate: "",
    car_model: "",
    address: "",
    notes: "",
    is_foreign_plate: false,
  });

  // Hook de email
  const emailService = useEmailService();

  // Procurar pontos de fidelidade do utilizador
  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      const { data, error } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        return;
      }

      if (data) {
        const hasLoyaltyDiscount =
          data.bookings_count > 0 && data.bookings_count % 5 === 4;
        setHasDiscount(hasLoyaltyDiscount);
      }
    };

    fetchLoyaltyPoints();
  }, [session]);

  // Verificar disponibilidade quando a data é selecionada
  useEffect(() => {
    const checkAvailability = async () => {
      if (!date) {
        setAvailability(null);
        return;
      }

      try {
        const availability = await checkDateAvailability(date);
        setAvailability(availability);

        // Se o horário selecionado não está mais disponível, redefinir
        if (
          formData.time_slot !== "custom" &&
          !availability[formData.time_slot as keyof typeof availability]
        ) {
          setFormData((prev) => ({ ...prev, time_slot: "morning" }));
        } else if (
          formData.time_slot === "custom" &&
          !availability.availableCustomTimes.includes(formData.custom_time)
        ) {
          setFormData((prev) => ({ ...prev, custom_time: "" }));
        }
      } catch {
        toast.error("Erro ao verificar disponibilidade. Tente novamente.");
      }
    };

    checkAvailability();
  }, [date]);

  // Verificar disponibilidade do mês quando o mês muda
  useEffect(() => {
    const checkMonthlyAvailability = async () => {
      const unavailable = await checkMonthAvailability(currentMonth);
      setUnavailableDates(unavailable);
    };

    checkMonthlyAvailability();
  }, [currentMonth]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "car_plate") {
      if (formData.is_foreign_plate) {
        // Para matrículas estrangeiras, não aplicamos formatação
        setFormData((prev) => ({ ...prev, [name]: value }));
        setLicensePlateError(null);
      } else {
        // Para matrículas portuguesas, aplicamos a formatação e validação
        const formattedValue = formatLicensePlate(value);
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));

        if (formattedValue.length === 8) {
          const isValid = validatePortugueseLicensePlate(formattedValue);
          setLicensePlateError(
            isValid
              ? null
              : "Formato de matrícula inválido. Deve seguir o padrão português (ex: AA-00-00, 00-AA-00, 00-00-AA ou AA-00-AA)"
          );
        } else {
          setLicensePlateError(null);
        }
      }
    } else if (name === "is_foreign_plate") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: isChecked,
        // Limpar a matrícula ao alternar entre os tipos
        car_plate: "",
      }));
      setLicensePlateError(null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Por favor, selecione uma data para a lavagem.");
      return;
    }

    if (formData.time_slot === "custom" && !formData.custom_time) {
      toast.error("Por favor, indique um horário personalizado.");
      return;
    }

    // Verificar se a matrícula é válida (apenas para matrículas portuguesas)
    if (
      !formData.is_foreign_plate &&
      !validatePortugueseLicensePlate(formData.car_plate)
    ) {
      toast.error("Por favor, insira uma matrícula portuguesa válida.");
      return;
    }

    // Verificar se há alguma matrícula inserida (para matrículas estrangeiras)
    if (formData.is_foreign_plate && !formData.car_plate.trim()) {
      toast.error("Por favor, insira a matrícula do veículo.");
      return;
    }

    // Verificar disponibilidade novamente antes de submeter
    try {
      const currentAvailability = await checkDateAvailability(date);

      if (formData.time_slot === "custom") {
        if (
          !currentAvailability.availableCustomTimes.includes(
            formData.custom_time
          )
        ) {
          toast.error(
            "O horário selecionado já não está disponível. Por favor, escolha outro horário."
          );
          setAvailability(currentAvailability);
          return;
        }
      } else if (
        !currentAvailability[
          formData.time_slot as keyof typeof currentAvailability
        ]
      ) {
        toast.error(
          "O horário selecionado já não está disponível. Por favor, escolha outro horário."
        );
        setAvailability(currentAvailability);
        return;
      }
    } catch {
      toast.error("Erro ao verificar disponibilidade. Tente novamente.");
      return;
    }

    setLoading(true);

    try {
      const formattedDate = format(date, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            user_id: session.user.id,
            service_type: formData.service_type,
            date: formattedDate,
            time_slot: formData.time_slot,
            custom_time: formData.custom_time,
            car_plate: formData.car_plate,
            car_model: formData.car_model,
            address: formData.address,
            notes: formData.notes,
            status: "pending",
            has_discount: hasDiscount,
            is_foreign_plate: formData.is_foreign_plate,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const booking = data[0];
        // Enviar email de confirmação ao cliente
        await emailService.sendBookingRequestEmail(booking);

        // Enviar notificação ao administrador (usando fetch direto para evitar problemas de autenticação)
        try {
          await fetch("/api/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-system-key": process.env.NEXT_PUBLIC_SYSTEM_API_KEY!,
            },
            body: JSON.stringify({
              type: "admin_new_booking",
              data: booking,
            }),
          });
        } catch (error) {
          console.error("Erro ao enviar notificação ao administrador:", error);
        }
      }

      toast.success(
        "Pedido de marcação enviado com sucesso! Receberá uma confirmação por email em breve."
      );

      setDate(undefined);
      setFormData({
        service_type: "complete",
        time_slot: "morning",
        custom_time: "",
        car_plate: "",
        car_model: "",
        address: "",
        notes: "",
        is_foreign_plate: false,
      });

      onCancel();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar marcação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onCancel} className="mr-2">
          <ArrowLeft size={16} />
        </Button>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Nova Marcação
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Serviço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Serviço
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`border rounded-md p-4 cursor-pointer transition-all ${
                formData.service_type === "complete"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => handleSelectChange("service_type", "complete")}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Lavagem Completa
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Interior + Exterior
                  </p>
                </div>
                {hasDiscount ? (
                  <div className="text-right">
                    <span className="font-bold text-gray-400 line-through block">
                      18€
                    </span>
                    <span className="font-bold text-green-600">9€</span>
                  </div>
                ) : (
                  <span className="font-bold text-primary">18€</span>
                )}
              </div>
            </div>
            <div
              className={`border rounded-md p-4 cursor-pointer transition-all ${
                formData.service_type === "exterior"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => handleSelectChange("service_type", "exterior")}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Lavagem Exterior
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Apenas exterior
                  </p>
                </div>
                {hasDiscount ? (
                  <div className="text-right">
                    <span className="font-bold text-gray-400 line-through block">
                      12€
                    </span>
                    <span className="font-bold text-green-600">6€</span>
                  </div>
                ) : (
                  <span className="font-bold text-primary">12€</span>
                )}
              </div>
            </div>
          </div>

          {hasDiscount && (
            <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                Parabéns! Você atingiu a 5ª lavagem e ganhou 50% de desconto
                nesta marcação.
              </p>
            </div>
          )}
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  date &&
                  availability &&
                  !availability.morning &&
                  !availability.afternoon &&
                  !availability.evening
                    ? "border-red-200 hover:border-red-40"
                    : ""
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                onMonthChange={setCurrentMonth}
                modifiers={{
                  unavailable: (date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      date < today ||
                      date.getDay() === 0 || // Domingo
                      date >
                        new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) ||
                      unavailableDates.some(
                        (unavailable) =>
                          unavailable.getFullYear() === date.getFullYear() &&
                          unavailable.getMonth() === date.getMonth() &&
                          unavailable.getDate() === date.getDate()
                      )
                    );
                  },
                }}
                modifiersStyles={{
                  unavailable: {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  },
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return (
                    date < today ||
                    date.getDay() === 0 || // Domingo
                    date >
                      new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) ||
                    unavailableDates.some(
                      (unavailable) =>
                        unavailable.getFullYear() === date.getFullYear() &&
                        unavailable.getMonth() === date.getMonth() &&
                        unavailable.getDate() === date.getDate()
                    )
                  );
                }}
                locale={pt}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Horário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Horário
          </label>
          {!date ? (
            <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
              Selecione uma data
            </div>
          ) : (
            <>
              <Select
                value={formData.time_slot}
                onValueChange={(value) =>
                  handleSelectChange("time_slot", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="morning"
                    disabled={!availability?.morning}
                    className={!availability?.morning ? "text-red-500" : ""}
                  >
                    Manhã (9h - 12h)
                    {!availability?.morning && " - Indisponível"}
                  </SelectItem>
                  <SelectItem
                    value="afternoon"
                    disabled={!availability?.afternoon}
                    className={!availability?.afternoon ? "text-red-500" : ""}
                  >
                    Tarde (13h - 17h)
                    {!availability?.afternoon && " - Indisponível"}
                  </SelectItem>
                  <SelectItem
                    value="evening"
                    disabled={!availability?.evening}
                    className={!availability?.evening ? "text-red-500" : ""}
                  >
                    Final do dia (17h - 19h)
                    {!availability?.evening && " - Indisponível"}
                  </SelectItem>
                  <SelectItem
                    value="custom"
                    disabled={!availability?.availableCustomTimes.length}
                    className={
                      !availability?.availableCustomTimes.length
                        ? "text-red-500"
                        : ""
                    }
                  >
                    Horário personalizado
                    {!availability?.availableCustomTimes.length &&
                      " - Indisponível"}
                  </SelectItem>
                </SelectContent>
              </Select>

              {formData.time_slot === "custom" && (
                <div className="mt-4">
                  <label
                    htmlFor="custom_time"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Horário Preferencial
                  </label>
                  <Select
                    value={formData.custom_time}
                    onValueChange={(value) =>
                      handleSelectChange("custom_time", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário específico" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {availability?.availableCustomTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Selecione um horário específico para a sua marcação.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Informações do Veículo */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="car_plate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Matrícula
            </label>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="is_foreign_plate"
                name="is_foreign_plate"
                checked={formData.is_foreign_plate}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="is_foreign_plate"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Matrícula estrangeira
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Car size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="car_plate"
                name="car_plate"
                value={formData.car_plate}
                onChange={handleChange}
                required
                maxLength={formData.is_foreign_plate ? 20 : 8}
                className={`w-full pl-10 px-4 py-2 border ${
                  licensePlateError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary"
                } rounded-md dark:bg-gray-800 dark:text-white`}
                placeholder={
                  formData.is_foreign_plate ? "Ex: AB 123 CD" : "Ex: AA-00-AA"
                }
              />
            </div>
            {licensePlateError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {licensePlateError}
              </p>
            )}
            {!formData.is_foreign_plate && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Formatos válidos: AA-00-00, 00-AA-00, 00-00-AA ou AA-00-AA.
              </p>
            )}
            {formData.is_foreign_plate && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Insira a matrícula no formato do país de origem.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="car_model"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Marca e Modelo
            </label>
            <input
              type="text"
              id="car_model"
              name="car_model"
              value={formData.car_model}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              placeholder="Ex: Renault Clio"
            />
          </div>
        </div>

        {/* Morada */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Local do veículo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              placeholder="Morada completa ou ponto de referência onde o carro estará estacionado"
            />
          </div>
        </div>

        {/* Notas */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Notas Adicionais (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white resize-none"
            placeholder="Informações adicionais que possam ser úteis, como a entrega da chave, etc."
          ></textarea>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                A enviar...
              </>
            ) : (
              "Confirmar Marcação"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
