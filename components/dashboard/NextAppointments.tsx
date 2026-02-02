'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
    id: string;
    patient: {
        name: string;
        photo_url?: string;
    };
    scheduled_at: string;
    location: {
        name: string;
    };
    status: 'confirmed' | 'pending' | 'missed' | 'cancelled';
}

interface NextAppointmentsProps {
    appointments: Appointment[];
}

const STATUS_LABELS = {
    confirmed: 'Confirmado',
    pending: 'Pendente',
    missed: 'Falta',
    cancelled: 'Cancelado',
};

export default function NextAppointments({ appointments }: NextAppointmentsProps) {
    return (
        <div className="card">
            <h3 className="text-sm font-medium text-foreground mb-4">
                Próximos atendimentos
            </h3>

            <div className="space-y-3">
                {appointments.map((appointment) => {
                    const date = new Date(appointment.scheduled_at);

                    return (
                        <div
                            key={appointment.id}
                            className="flex items-start justify-between py-3 border-b border-border last:border-0"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                    {appointment.patient.name}
                                </p>
                                <p className="text-xs text-muted mt-0.5">
                                    {format(date, "HH:mm", { locale: ptBR })} • {appointment.location.name}
                                </p>
                            </div>

                            <span className={`badge ${appointment.status === 'confirmed' ? 'badge-success' :
                                    appointment.status === 'pending' ? 'badge-warning' :
                                        'badge-gray'
                                }`}>
                                {STATUS_LABELS[appointment.status]}
                            </span>
                        </div>
                    );
                })}
            </div>

            <button className="btn btn-secondary w-full mt-4 text-sm">
                Ver todos
            </button>
        </div>
    );
}
