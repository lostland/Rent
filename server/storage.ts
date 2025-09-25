import { randomUUID } from "crypto";
import {
  users,
  inquiries,
  serviceTypes,
  appointments,
  type User,
  type UpsertUser,
  type Inquiry,
  type InsertInquiry,
  type ServiceType,
  type InsertServiceType,
  type Appointment,
  type InsertAppointment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;
  updateInquiryStatus(id: string, status: string): Promise<void>;
  
  // Service type operations
  getAllServiceTypes(): Promise<ServiceType[]>;
  createServiceType(serviceType: InsertServiceType): Promise<ServiceType>;
  
  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private readonly db = db;

  constructor() {
    if (!this.db) {
      throw new Error("Database connection is not configured.");
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db!.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await this.db!
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Inquiry operations
  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await this.db!
      .insert(inquiries)
      .values(inquiryData)
      .returning();
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await this.db!
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));
  }

  async updateInquiryStatus(id: string, status: string): Promise<void> {
    await this.db!
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id));
  }

  // Service type operations
  async getAllServiceTypes(): Promise<ServiceType[]> {
    return await this.db!
      .select()
      .from(serviceTypes)
      .where(eq(serviceTypes.isActive, "active"))
      .orderBy(serviceTypes.name);
  }

  async createServiceType(serviceTypeData: InsertServiceType): Promise<ServiceType> {
    const [serviceType] = await this.db!
      .insert(serviceTypes)
      .values(serviceTypeData)
      .returning();
    return serviceType;
  }

  // Appointment operations
  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const [appointment] = await this.db!
      .insert(appointments)
      .values(appointmentData)
      .returning();
    return appointment;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await this.db!
      .select()
      .from(appointments)
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await this.db!
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, startOfDay),
          lte(appointments.appointmentDate, endOfDay)
        )
      )
      .orderBy(appointments.appointmentDate);
  }

  async updateAppointmentStatus(id: string, status: string): Promise<void> {
    await this.db!
      .update(appointments)
      .set({ status, updatedAt: new Date() })
      .where(eq(appointments.id, id));
  }
}

class InMemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private inquiries: Inquiry[] = [];
  private serviceTypes: ServiceType[] = [];
  private appointments: Appointment[] = [];

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id ?? randomUUID();
    const now = new Date();
    const existing = this.users.get(id);

    const user: User = {
      id,
      email: userData.email ?? existing?.email ?? null,
      firstName: userData.firstName ?? existing?.firstName ?? null,
      lastName: userData.lastName ?? existing?.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? existing?.profileImageUrl ?? null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.users.set(id, user);
    return user;
  }

  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const inquiry: Inquiry = {
      id: randomUUID(),
      name: inquiryData.name,
      phone: inquiryData.phone,
      inquiry: inquiryData.inquiry,
      createdAt: new Date(),
      status: "new",
    };

    this.inquiries = [inquiry, ...this.inquiries];
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return [...this.inquiries].sort((a, b) => {
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  async updateInquiryStatus(id: string, status: string): Promise<void> {
    const inquiry = this.inquiries.find((item) => item.id === id);
    if (inquiry) {
      inquiry.status = status;
    }
  }

  async getAllServiceTypes(): Promise<ServiceType[]> {
    return this.serviceTypes
      .filter((serviceType) => serviceType.isActive === "active")
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  async createServiceType(serviceTypeData: InsertServiceType): Promise<ServiceType> {
    const serviceType: ServiceType = {
      id: randomUUID(),
      name: serviceTypeData.name,
      description: serviceTypeData.description ?? null,
      duration: serviceTypeData.duration,
      price: serviceTypeData.price ?? null,
      isActive: "active",
      createdAt: new Date(),
    };

    this.serviceTypes.push(serviceType);
    return serviceType;
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const appointmentDate =
      appointmentData.appointmentDate instanceof Date
        ? appointmentData.appointmentDate
        : new Date(appointmentData.appointmentDate);

    const appointment: Appointment = {
      id: randomUUID(),
      name: appointmentData.name,
      phone: appointmentData.phone,
      email: appointmentData.email ?? null,
      serviceTypeId: appointmentData.serviceTypeId ?? null,
      appointmentDate,
      notes: appointmentData.notes ?? null,
      address: appointmentData.address ?? null,
      latitude: appointmentData.latitude ?? null,
      longitude: appointmentData.longitude ?? null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.appointments.push(appointment);
    return appointment;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return [...this.appointments].sort(
      (a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime(),
    );
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return this.appointments.filter((appointment) => {
      const time = appointment.appointmentDate.getTime();
      return time >= startOfDay.getTime() && time <= endOfDay.getTime();
    });
  }

  async updateAppointmentStatus(id: string, status: string): Promise<void> {
    const appointment = this.appointments.find((item) => item.id === id);
    if (appointment) {
      appointment.status = status;
      appointment.updatedAt = new Date();
    }
  }
}

export const storage: IStorage = process.env.LANDING_DATABASE_URL
  ? new DatabaseStorage()
  : new InMemoryStorage();
