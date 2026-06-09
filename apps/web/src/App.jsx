import { useState, useEffect } from "react";
import EvenementCarte from "./components/EvenementCarte";
import SearchBar from "./components/SearchBar";
import styles from "./App.module.css";

const App = () => {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true); // Démarre à true car le chargement est immédiat
  const [recherche, setRecherche] = useState("");

  // Étape 1.1 : Migrer le fetch dans useEffect au montage
  useEffect(() => {
    const charger = async () => {
      try {
        const reponse = await fetch("/evenements.json");
        const data = await reponse.json();
        setEvenements(data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
      setChargement(false); // Le chargement est fini
    };

    charger();
  }, []); // <-- Tableau de dépendances VIDE = exécution UNE SEULE FOIS au montage

  // Logique de filtrage en temps réel (Khady)
  const evenementsFiltres = evenements.filter((ev) =>
    ev.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>SenEvent --- Événements à Dakar</h1>
      <SearchBar recherche={recherche} onRecherche={setRecherche} />

      <p className={styles.compteur}>
        {evenementsFiltres.length} événement(s) trouvé(s)
      </p>

      {/* Rendu conditionnel pendant le chargement initial */}
      {chargement ? (
        <p>Chargement des événements de Dakar...</p>
      ) : (
        evenementsFiltres.map((ev) => (
          <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
        ))
      )}
    </div>
  );
};

export default App;