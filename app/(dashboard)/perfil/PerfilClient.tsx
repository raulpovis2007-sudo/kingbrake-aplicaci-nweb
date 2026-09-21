"use client";

import { useState, useEffect } from "react";
import { User, Car, MapPin, Save, Check } from "lucide-react";
import styles from "./Perfil.module.css";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferredDistributorId: string | null;
  vehicle: {
    id: string;
    vehicleModelId: string;
    year: number;
    vehicleModel: {
      id: string;
      name: string;
      brand: { id: string; name: string };
    };
  } | null;
}

interface Brand {
  id: string;
  name: string;
}

interface VehicleModel {
  id: string;
  name: string;
}

interface Distributor {
  id: string;
  name: string;
  address: string;
}

interface Props {
  user: UserData;
  brands: Brand[];
  distributors: Distributor[];
}

export default function PerfilClient({ user, brands, distributors }: Props) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [brandId, setBrandId] = useState(user.vehicle?.vehicleModel.brand.id || "");
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [modelId, setModelId] = useState(user.vehicle?.vehicleModelId || "");
  const [year, setYear] = useState(user.vehicle?.year || 0);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [savedVehicle, setSavedVehicle] = useState(false);

  const [distributorId, setDistributorId] = useState(user.preferredDistributorId || "");
  const [savedDistributor, setSavedDistributor] = useState(false);

  useEffect(() => {
    if (!brandId) { setModels([]); return; }
    fetch(`/api/vehicles/models?brandId=${brandId}`)
      .then((r) => r.json())
      .then(setModels)
      .catch(() => setModels([]));
  }, [brandId]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => currentYear - i);

  const handleSaveProfile = async () => {
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveVehicle = async () => {
    if (!modelId || !year) return;
    setSavingVehicle(true);
    await fetch("/api/user/vehicle", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleModelId: modelId, year }),
    });
    setSavingVehicle(false);
    setSavedVehicle(true);
    setTimeout(() => setSavedVehicle(false), 2000);
  };

  const handleDistributorChange = async (value: string) => {
    setDistributorId(value);
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredDistributorId: value || null }),
    });
    setSavedDistributor(true);
    setTimeout(() => setSavedDistributor(false), 2000);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mi Perfil</h1>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <User size={20} />
            <h2>Datos personales</h2>
          </div>
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Teléfono</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="999 999 999" />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input value={user.email} disabled className={styles.disabled} />
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className={styles.saveBtn}>
              {saved ? <><Check size={16} /> Guardado</> : <><Save size={16} /> {saving ? "Guardando..." : "Guardar cambios"}</>}
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Car size={20} />
            <h2>Mi vehículo</h2>
          </div>
          {user.vehicle && !brandId && (
            <p className={styles.currentVehicle}>
              {user.vehicle.vehicleModel.brand.name} {user.vehicle.vehicleModel.name} {user.vehicle.year}
            </p>
          )}
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Marca</label>
              <select value={brandId} onChange={(e) => { setBrandId(e.target.value); setModelId(""); setYear(0); }}>
                <option value="">Seleccionar marca</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Modelo</label>
              <select value={modelId} onChange={(e) => { setModelId(e.target.value); setYear(0); }} disabled={!brandId}>
                <option value="">Seleccionar modelo</option>
                {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Año</label>
              <select value={year || ""} onChange={(e) => setYear(Number(e.target.value))} disabled={!modelId}>
                <option value="">Seleccionar año</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button onClick={handleSaveVehicle} disabled={savingVehicle || !modelId || !year} className={styles.saveBtn}>
              {savedVehicle ? <><Check size={16} /> Guardado</> : <><Save size={16} /> {savingVehicle ? "Guardando..." : "Guardar vehículo"}</>}
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <MapPin size={20} />
            <h2>Distribuidor preferido</h2>
          </div>
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Selecciona tu distribuidor más cercano</label>
              <select value={distributorId} onChange={(e) => handleDistributorChange(e.target.value)}>
                <option value="">Sin preferencia</option>
                {distributors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} — {d.address}</option>
                ))}
              </select>
            </div>
            {savedDistributor && <p className={styles.savedMsg}><Check size={14} /> Guardado automáticamente</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
