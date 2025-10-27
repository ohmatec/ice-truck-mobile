// src/services/adapters/truck.ts
import { TruckDTO, HistoryItemDTO } from '@src/types/dto';
import { Truck, HistoryItem } from '@src/types/model';

export const toTruck = (dto: TruckDTO): Truck => ({
  id: dto.id,
  name: dto.name,
  maxKg: dto.maxKg,
  weightKg: dto.weightKg,
});

export const toHistoryItem = (dto: HistoryItemDTO): HistoryItem => ({
  id: dto.id,
  truckId: dto.truckId,
  title: dto.title,
  location: dto.location,
  desc: dto.desc,
  highlight: dto.highlight,
  time: new Date(dto.timeISO),
});
