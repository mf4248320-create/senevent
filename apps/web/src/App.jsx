import { useState, useEffect } from "react";
import EvenementCarte from "./components/EvenementCarte";
import SearchBar from "./components/SearchBar";
import EtatChargement from "./components/EtatChargement";
import styles from "./App.module.css";

const App = () => {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");

  // Fonction de chargement globale et réutilisable
  const charger = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const reponse = await fetch("/evenements.json");

      if (!reponse.ok) {
        throw new Error(`Erreur HTTP ${reponse.status}`);
      }

      const data = await reponse.json();
      setEvenements(data);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  };

  // 1. Déclenchement automatique au montage du composant (Étape 1)
  useEffect(() => {
    charger();
  }, []);

  // 💡 2. EXERCICE FINAL : Mesure du temps passé sur la page avec fonction de nettoyage
  useEffect(() => {
    const debut = Date.now(); // Enregistre l'heure au montage du composant

    // Retourne la fonction de nettoyage (exécutée au démontage du composant)
    return () => {
      const duree = Date.now() - debut;
      console.log("Temps sur la page :", duree, "ms");
    };
  }, []); // Tableau de dépendances vide pour ne s'exécuter qu'au montage/démontage

  // Logique de filtrage en temps réel
  const evenementsFiltres = evenements.filter((ev) =>
    ev.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  // 3. Synchroniser le titre de l'onglet du navigateur avec le compteur (Étape 3)
  useEffect(() => {
    if (evenementsFiltres.length > 0) {
      document.title = `(${evenementsFiltres.length}) SenEvent`;
    } else {
      document.title = "SenEvent";
    }
  }, [evenementsFiltres.length]);

  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>SenEvent --- Événements à Dakar</h1>

      {/* Rendu conditionnel : État de chargement (Étape 4) */}
      {chargement && <EtatChargement />}

      {/* Rendu conditionnel : État d'erreur */}
      {erreur && (
        <div className={styles.erreur}>
          <p>Erreur : {erreur}</p>
          <button className={styles.bouton} onClick={charger}>
            Réessayer
          </button>
        </div>
      )}

      {/* Rendu conditionnel : État de succès */}
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

// Sous-tâche A complétée par Moussa