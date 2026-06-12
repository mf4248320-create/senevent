import styles from "./EtatChargement.module.css";

const EtatChargement = ({ chargement, erreur, onReessayer }) => {
  if (chargement) {
    return (
      <p className={styles.message}>Chargement des evenements...</p>
    );
  }

  if (erreur) {
    return (
      <div className={styles.erreur}>
        <p>Erreur : {erreur}</p>
        <button className={styles.bouton} onClick={onReessayer}>
          Reessayer
        </button>
      </div>
    );
  }

  return null;
};

export default EtatChargement;