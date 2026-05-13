import { useState, useEffect } from "react";
import { Alert } from "react-native";

export type PokemonData = {
  name: string;
  types: string[];
  moves: { name: string; type?: string }[];
  image: any;
};

export function usePokemon() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allPossibleMoves, setAllPossibleMoves] = useState<any[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData>({
    name: "Pesquise um Pokémon",
    types: [],
    moves: [
        { name: "-" },
        { name: "-" },
        { name: "-" },
        { name: "-" }
    ],
    image: null,
  });

  // --- FUNÇÃO DE RESET (NOVO) ---
  const resetSelectedPokemon = () => {
    setSelectedPokemon({
      name: "Pesquise um Pokémon",
      types: [],
      moves: [
          { name: "-" },
          { name: "-" },
          { name: "-" },
          { name: "-" }
      ],
      image: null,
    });
    setSearchQuery(""); 
    setAllPossibleMoves([]);
  };
  // ------------------------------

  useEffect(() => {
    const fetchAllNames = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
        const data = await response.json();
        setAllPokemonNames(data.results.map((p: any) => p.name));
      } catch (e) {
        console.error("Erro ao carregar lista de nomes");
      }
    };
    fetchAllNames();
  }, []);

  const handleSearch = async (nameToSearch?: string) => {
    const pokemonName = nameToSearch || searchQuery;
    if (!pokemonName) return;

    setLoading(true);
    setSuggestions([]);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim().replace(/\s+/g, '-')}`);
      if (!response.ok) throw new Error();
      
      const data = await response.json();

      const emptyMoves = [
        { name: "Select move..." },
        { name: "Select move..." },
        { name: "Select move..." },
        { name: "Select move..." }
      ];
      
      setSelectedPokemon({
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        types: data.types.map((t: any) => t.type.name),
        moves: emptyMoves, 
        image: { uri: data.sprites.other["official-artwork"].front_default || data.sprites.front_default },
      });

      setAllPossibleMoves(data.moves);
      setSearchQuery(data.name);
    } catch (error) {
        Alert.alert("Erro", "Pokémon não encontrado.");
    } finally {
        setLoading(false);
    }
  };

  const onTypeSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 1) {
      const filtered = allPokemonNames
        .filter(name => name.toLowerCase().includes(text.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const openMovePicker = (slotIndex: number) => {
    if (allPossibleMoves.length === 0) return; 
    setActiveSlot(slotIndex);
    setIsModalVisible(true);
  };

  const selectMove = async (moveName: string) => {
    if (activeSlot === null) return;
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
        const data = await response.json();
        const moveType = data.type.name;

        const newMoves = [...selectedPokemon.moves];
        newMoves[activeSlot] = { name: moveName, type: moveType };
        
        setSelectedPokemon({ ...selectedPokemon, moves: newMoves });
    } catch (e) {
        const newMoves = [...selectedPokemon.moves];
        newMoves[activeSlot] = { name: moveName };
        setSelectedPokemon({ ...selectedPokemon, moves: newMoves });
    } finally {
        setIsModalVisible(false);
    }
  };

  return {
    loading,
    searchQuery,
    suggestions,
    selectedPokemon,
    allPossibleMoves,
    isModalVisible,
    setIsModalVisible,
    handleSearch,
    onTypeSearch,
    openMovePicker,
    selectMove,
    setSelectedPokemon,
    resetSelectedPokemon // <--- ADICIONADO NO RETURN (NOVO)
  };
}