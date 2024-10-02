import { Kitchen, LocalLaundryService, Warehouse } from "@mui/icons-material";

export const Amenities = ["washer", "dryer", "dishwasher", "storage", "oven", "stove", "refrigerator", "elevator", "electricity", "pets"] as const;

export const AmenityIcons = {
    washer: LocalLaundryService,
    dryer: LocalLaundryService,
    dishwasher: Kitchen,
    storage: Warehouse,
    oven: Kitchen,
    stove: Kitchen,
    refrigerator: Kitchen,
    elevator: Kitchen,
    electricity: Kitchen,
    pets: Kitchen
}