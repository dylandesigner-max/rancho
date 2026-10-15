import { useState } from 'react';

import { AmountField, BottomSheet, Button, TextField } from '@/components/onda';

// Tela 7 · Nova compra (Figma: Prototype → 07 · Nova compra).

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const suggestedName = () => `Rancho de ${MONTHS[new Date().getMonth()]}`;

type NovaCompraSheetProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, budgetCents: number) => void;
};

export function NovaCompraSheet({ visible, onClose, onCreate }: NovaCompraSheetProps) {
  const [name, setName] = useState(suggestedName);
  const [budgetCents, setBudgetCents] = useState(0);
  // Orçamento é obrigatório: é o centro do controle de gastos.
  const canCreate = name.trim().length > 0 && budgetCents > 0;

  return (
    <BottomSheet
      visible={visible}
      title="Nova compra"
      onClose={onClose}
      footer={
        <Button label="Criar compra" disabled={!canCreate} onPress={() => onCreate(name.trim(), budgetCents)} />
      }>
      <TextField label="Nome da compra" value={name} onChangeText={setName} autoCapitalize="sentences" returnKeyType="next" />
      <AmountField
        label="Orçamento"
        valueCents={budgetCents}
        onChangeCents={setBudgetCents}
        helper="Quanto você pretende gastar. Dá para mudar depois."
      />
    </BottomSheet>
  );
}
