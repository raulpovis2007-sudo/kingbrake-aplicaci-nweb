import { Fragment } from "react";
import styles from "./MetricasSection.module.css";

const METRICS = [
  { value: "+15", label: "Años de experiencia" },
  { value: "+1000", label: "Aplicaciones" },
  { value: "+50", label: "Puntos de Venta" },
  { value: "+10", label: "Líneas de Producto" },
];

export default function MetricasSection() {
  return (
    <section className={styles.wrapper} id="metricas">
      <div className={styles.container}>
        {METRICS.map((m, i) => (
          <Fragment key={m.label}>
            {i > 0 && <div className={styles.divider} />}
            <div className={styles.metric}>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricLabel}>{m.label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
