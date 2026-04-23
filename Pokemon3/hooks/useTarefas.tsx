import { useState } from 'react';

interface Tarefa {
  id: string;
  texto: string;
  concluida: boolean; // 👈 CORRETO
}

export function useTarefas() {

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState<string>('');

  const adicionarTarefa = () => {
    if (novaTarefa.trim() === '') return;

    const nova: Tarefa = {
      id: Date.now().toString(),
      texto: novaTarefa,
      concluida: false, // 👈 IMPORTANTE
    };

    setTarefas([...tarefas, nova]);
    setNovaTarefa('');
  };

  const alternarTarefa = (id: string) => { // 👈 TIPADO
    setTarefas((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      )
    );
  };

  const removerTarefa = (id: string) => {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tarefas,
    novaTarefa,
    setNovaTarefa,
    adicionarTarefa,
    removerTarefa,
    alternarTarefa,
  };
}