import { useState, useEffect } from "react";
import EvenementCarte from "./components/EvenementCarte";
import SearchBar from "./components/SearchBar";
import styles from "./App.module.css";

const App = () => {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");

  // Fonction de chargement globale et réutilisable
  const charger = async () => {
    setChargement(true);
    setErreur(null); // On efface l'erreur précédente avant de réessayer
    try {
      // URL normale de succès
      const reponse = await fetch("/evenements.json");

      // Vérification explicite du statut HTTP (gère les erreurs 404, 500)
      if (!reponse.ok) {
        throw new Error(`Erreur HTTP ${reponse.status}`);
      }

      const data = await reponse.json();
      setEvenements(data);
    } catch (e) {
      setErreur(e.message); // Capture le message d'erreur (ex: "Erreur HTTP 404")
    } finally {
      setChargement(false); // S'exécute quoi qu'il arrive (succès ou échec)
    }
  };

  // Déclenchement automatique au montage du composant (Étape 1)
  useEffect(() => {
    charger();
  }, []);

  // 💡 LOGIQUE DE FILTRAGE : Placée AVANT l'effet du titre pour que `evenementsFiltres` soit accessible
  const evenementsFiltres = evenements.filter((ev) =>
    ev.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  // 🚀 ÉTAPE 3 : Synchroniser le titre de l'onglet du navigateur avec le compteur
  useEffect(() => {
    if (evenementsFiltres.length > 0) {
      document.title = `(${evenementsFiltres.length}) SenEvent`; // ex: (5) SenEvent
    } else {
      document.title = "SenEvent"; // Si aucun résultat ne correspond
    }
  }, [evenementsFiltres.length]); // S'exécute uniquement si la longueur change 

  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>SenEvent --- Événements à Dakar</h1>

      {/* 1. Rendu conditionnel : État de chargement (LOADING) */}
      {chargement && (
        <p className={styles.message}>Chargement des événements ...</p>
      )}

      {/* 2. Rendu conditionnel : État d'erreur (ERROR) */}
      {erreur && (
        <div className={styles.erreur}>
          <p>Erreur : {erreur}</p>
          <button className={styles.bouton} onClick={charger}>
            Réessayer
          </button>
        </div>
      )}

      {/* 3. Rendu conditionnel : État de succès (SUCCESS) */}
      {!chargement && !erreur && (
        <>
          <SearchBar recherche={recherche} onRecherche={setRecherche} />

          <p className={styles.compteur}>
            {evenementsFiltres.length} événement(s) trouvé(s)
          </p>

          {/* Gestion du cas où le filtre ne trouve rien */}
          {evenementsFiltres.length === 0 ? (
            <p className={styles.message}>Aucun événement ne correspond.</p>
          ) : (
            evenementsFiltres.map((ev) => (
              <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default App;