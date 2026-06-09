import styles from "./SearchBar.module.css";

const SearchBar = ({ recherche, onRecherche }) => {
  return (
    <div className={styles.conteneur}>
      <input
        className={styles.input}
        type="text"
        placeholder="Rechercher un événement..."
        value={recherche}
        onChange={e => onRecherche(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
