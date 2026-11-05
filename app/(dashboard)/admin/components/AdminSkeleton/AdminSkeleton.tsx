import styles from "./AdminSkeleton.module.css";

interface Props {
  variant?: "table" | "cards";
  rows?: number;
  cols?: 3 | 4 | 5;
  showImage?: boolean;
}

export default function AdminSkeleton({ variant = "table", rows = 6, cols = 4, showImage = false }: Props) {
  const colClass = cols === 3 ? styles.cols3 : cols === 5 ? styles.cols5 : styles.cols4;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleBone} />
        <div className={styles.btnBone} />
      </div>

      {variant === "table" ? (
        <>
          <div className={`${styles.tableHead} ${colClass}`}>
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} className={styles.cellBone} />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className={`${styles.tableRow} ${colClass}`}>
              {showImage && <div className={styles.imgBone} />}
              {Array.from({ length: cols - (showImage ? 1 : 0) - 1 }).map((_, c) => (
                <div key={c} className={c === 0 ? styles.cellBone : styles.cellShort} />
              ))}
              <div className={styles.actionsBone}>
                <div className={styles.actionDot} />
                <div className={styles.actionDot} />
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.cardsGrid}>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className={styles.card}>
              <div className={styles.cardImgBone} />
              <div className={styles.cardLine} />
              <div className={styles.cardLineShort} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
