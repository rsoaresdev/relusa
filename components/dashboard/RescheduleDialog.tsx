"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Booking } from "@/lib/supabase/config";
import { format, parseISO, addDays } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkDateAvailability, TimeSlotAvailability } from "@/lib/utils";

interface RescheduleDialogProps {
  booking: Booking & {
    user_name?: string;
    user_email?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (
    bookingId: string,
    newDate: string,
    newTimeSlot: string,
    newCustomTime?: string
  ) => Promise<boolean>;
}

export default function RescheduleDialog({
  booking,
  open,
  onOpenChange,
  onReschedule,
}: RescheduleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("morning");
  const [customTime, setCustomTime] = useState<string>("");
  const [availability, setAvailability] = useState<TimeSlotAvailability | null>(
    null
  );

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setDate(undefined);
      setTimeSlot("morning");
      setCustomTime("");
      setAvailability(null);
    }
  }, [open]);

  // Check availability when date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!date) {
        setAvailability(null);
        return;
      }

      try {
        const availabilityData = await checkDateAvailability(date);
        setAvailability(availabilityData);
      } catch (error) {
        console.error("Erro ao verificar disponibilidade:", error);
        setAvailability(null);
      }
    };

    checkAvailability();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      return;
    }

    setLoading(true);

    try {
      const newDate = format(date, "yyyy-MM-dd");
      const newCustomTime = timeSlot === "custom" ? customTime : undefined;

      const success = await onReschedule(
        booking.id,
        newDate,
        timeSlot,
        newCustomTime
      );

      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erro ao reagendar:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotText = (slot: string, custom?: string) => {
    switch (slot) {
      case "morning":
        return "Manhã (9h-12h)";
      case "afternoon":
        return "Tarde (13h-17h)";
      case "evening":
        return "Final do dia (17h-20h)";
      case "custom":
        return custom ? `Personalizado (${custom})` : "Personalizado";
      default:
        return "Não definido";
    }
  };

  const isTimeSlotAvailable = (slot: string) => {
    if (!availability) return true;

    switch (slot) {
      case "morning":
        return availability.morning;
      case "afternoon":
        return availability.afternoon;
      case "evening":
        return availability.evening;
      default:
        return true;
    }
  };

  // Disable past dates and today
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < addDays(today, 1); // Only allow dates from tomorrow onwards
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Reagendar Marcação
          </DialogTitle>
          <DialogDescription>
            Altere a data e horário da marcação de{" "}
            <strong>{booking.user_name || "Cliente"}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current booking info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
              Marcação Atual:
            </h4>
            <p className="text-sm">
              <strong>Data:</strong>{" "}
              {format(parseISO(booking.date), "EEEE, d 'de' MMMM 'de' yyyy", {
                locale: pt,
              })}
            </p>
            <p className="text-sm">
              <strong>Horário:</strong>{" "}
              {getTimeSlotText(booking.time_slot, booking.custom_time)}
            </p>
          </div>

          {/* New date selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Nova Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={disabledDates}
                  initialFocus
                  locale={pt}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time slot selection */}
          <div className="space-y-2">
            <Label htmlFor="timeSlot">Novo Horário</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="morning"
                  disabled={!isTimeSlotAvailable("morning")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Manhã (9h-12h)</span>
                    {!isTimeSlotAvailable("morning") && (
                      <span className="text-xs text-red-500 ml-2">
                        Indisponível
                      </span>
                    )}
                  </div>
                </SelectItem>
                <SelectItem
                  value="afternoon"
                  disabled={!isTimeSlotAvailable("afternoon")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Tarde (13h-17h)</span>
                    {!isTimeSlotAvailable("afternoon") && (
                      <span className="text-xs text-red-500 ml-2">
                        Indisponível
                      </span>
                    )}
                  </div>
                </SelectItem>
                <SelectItem
                  value="evening"
                  disabled={!isTimeSlotAvailable("evening")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Final do dia (17h-20h)</span>
                    {!isTimeSlotAvailable("evening") && (
                      <span className="text-xs text-red-500 ml-2">
                        Indisponível
                      </span>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="custom">Horário personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom time input */}
          {timeSlot === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customTime">Horário Personalizado</Label>
              <Input
                id="customTime"
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                min="08:00"
                max="20:00"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Horário de funcionamento: 8h às 20h
              </p>
            </div>
          )}

          {/* Availability info */}
          {availability && date && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>
                  Disponibilidade para {format(date, "d/MM/yyyy")}:
                </strong>
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                <li>
                  Manhã: {availability.morning ? "✅ Disponível" : "❌ Ocupado"}
                </li>
                <li>
                  Tarde:{" "}
                  {availability.afternoon ? "✅ Disponível" : "❌ Ocupado"}
                </li>
                <li>
                  Final do dia:{" "}
                  {availability.evening ? "✅ Disponível" : "❌ Ocupado"}
                </li>
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading || !date || (timeSlot === "custom" && !customTime)
              }
            >
              {loading ? "A reagendar..." : "Reagendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
