import { StyleSheet, Text, View } from 'react-native';

import { formatBRL } from '@/lib/money';
import { radius, space, text, useOnda } from '@/theme/onda';

import { ProgressBar } from './progress-bar';

type BudgetSummaryProps = {
  budgetCents: number;
  spentCents: number;
};

/**
 * BudgetSummary do Onda (State=Normal): saldo disponível em destaque, barra do gasto
 * e detalhes gasto/orçamento. Estados de alerta entram com a tela 12.
 */
export function BudgetSummary({ budgetCents, spentCents }: BudgetSummaryProps) {
  const { color } = useOnda();
  const balance = budgetCents - spentCents;

  return (
    <View style={[styles.root, { backgroundColor: color.bg.surface, borderColor: color.border.default }]}>
      <View style={styles.balance}>
        <Text style={[text.caption, { color: color.text.secondary }]}>Saldo disponível</Text>
        <Text style={[text.amount.large, { color: color.text.primary }]} accessibilityLabel={`Saldo disponível ${formatBRL(balance)}`}>
          {formatBRL(balance)}
        </Text>
      </View>
      <ProgressBar
        value={budgetCents > 0 ? spentCents / budgetCents : 0}
        accessibilityLabel="Quanto do orçamento já foi gasto"
      />
      <View style={styles.details}>
        <View style={styles.col}>
          <Text style={[text.caption, { color: color.text.secondary }]}>Gasto</Text>
          <Text style={[text.amount.small, { color: color.text.primary }]}>{formatBRL(spentCents)}</Text>
        </View>
        <View style={[styles.col, styles.end]}>
          <Text style={[text.caption, { color: color.text.secondary }]}>Orçamento</Text>
          <Text style={[text.amount.small, { color: color.text.primary }]}>{formatBRL(budgetCents)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.sm,
  },
  balance: {
    gap: space['3xs'],
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    gap: space['3xs'],
  },
  end: {
    alignItems: 'flex-end',
  },
});
