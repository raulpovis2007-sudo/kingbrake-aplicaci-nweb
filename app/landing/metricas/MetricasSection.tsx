import React from "react";
import styles from "./MetricasSection.module.css";

export default function MetricasSection() {
  const metrics = [
    {
      description: "Años de experiencia",
      value: "+15",
    },
    {
      description: "Modelos compatibles",
      value: "+200",
    },
    {
      description: "Puntos de venta",
      value: "+50",
    },
  ];

  return (
    <div className={styles.wrapper} id="metricas">
      <div className={styles.container}>
        <h2 className={styles.title}>
          Seguridad que se mide
          <span className={styles.highlight}>en cada frenada.</span>
        </h2>
        <div className={styles.metricsContainer}>
          {metrics.map((item, index) => (
            <div key={index} className={styles.metric}>
              <div className={styles.metricInfo}>
                <span className={styles.metricValue}>{item.value}</span>
                <h4 className={styles.subtitle}>{item.description}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
