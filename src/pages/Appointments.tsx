
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, User, Stethoscope } from "lucide-react";
import { toast } from "sonner";

// Mock doctor data
const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", availableDays: [1, 2, 3, 4, 5] },
  { id: 2, name: "Dr. Michael Chen", specialty: "Neurology", availableDays: [0, 1, 3, 5] },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrics", availableDays: [1, 2, 4] },
  { id: 4, name: "Dr. James Wilson", specialty: "Orthopedics", availableDays: [0, 2, 4, 5] },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const Appointments = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useUser();
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [bookedAppointments, setBookedAppointments] = useState<Array<{
    doctorId: number;
    date: Date;
    time: string;
    reason: string;
  }>>([]);

  // Redirect if not authenticated or not a patient
  if (!isAuthenticated || role !== "patient") {
    navigate("/");
    return null;
  }

  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    if (!selectedDoctor) return true;
    
    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) return true;
    
    // Check if the day is available for the selected doctor
    return !doctor.availableDays.includes(date.getDay());
  };

  // Function to book an appointment
  const bookAppointment = () => {
    if (!selectedDoctor || !date || !time || !reason.trim()) {
      toast.error("Please fill in all the appointment details");
      return;
    }

    const newAppointment = {
      doctorId: selectedDoctor,
      date: date,
      time: time,
      reason: reason
    };

    setBookedAppointments([...bookedAppointments, newAppointment]);
    
    // Reset form
    setSelectedDoctor(null);
    setDate(undefined);
    setTime(null);
    setReason("");
    
    toast.success("Appointment booked successfully!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-medicare-blue">Book an Appointment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Schedule a New Appointment</CardTitle>
                <CardDescription>Choose a doctor, date, and time to book your appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Select a Doctor</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.map(doctor => (
                      <Card 
                        key={doctor.id} 
                        className={cn(
                          "cursor-pointer transition-all hover:border-medicare-blue",
                          selectedDoctor === doctor.id ? "border-medicare-blue bg-blue-50" : ""
                        )}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className="bg-medicare-blue/10 p-3 rounded-full">
                            <Stethoscope className="h-6 w-6 text-medicare-blue" />
                          </div>
                          <div>
                            <h3 className="font-medium">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Select a Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                          disabled={!selectedDoctor}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => 
                            date < new Date() || // Past dates
                            isDateDisabled(date)  // Days the doctor isn't available
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Select a Time</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant="outline"
                          size="sm"
                          className={cn(
                            time === slot ? "bg-medicare-blue text-white" : "",
                            "flex items-center gap-1"
                          )}
                          onClick={() => setTime(slot)}
                          disabled={!date}
                        >
                          <Clock className="h-3 w-3" /> {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    placeholder="Briefly describe your symptoms or reason for visit"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-medicare-blue hover:bg-medicare-dark" 
                  onClick={bookAppointment}
                  disabled={!selectedDoctor || !date || !time || !reason.trim()}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>Upcoming appointments you've scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                {bookedAppointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments scheduled yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookedAppointments.map((appointment, index) => {
                      const doctor = doctors.find(d => d.id === appointment.doctorId);
                      return (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-medicare-blue" />
                              <span className="font-medium">{doctor?.name}</span>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{format(appointment.date, "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.time}</span>
                              </div>
                              <p className="mt-2 text-xs">{appointment.reason}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
