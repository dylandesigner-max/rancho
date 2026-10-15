import CircleAlert from 'lucide-react-native/icons/circle-alert';
import { StyleSheet, Text, View } from 'react-native';

import { formatBRL } from '@/lib/money';
import { radius, space, text, useOnda } from '@/theme/onda';

import { ProgressBar } from './progress-bar';

type BudgetSummaryProps = {
  budgetCents: number;
  spentCents: number;
};

export type BudgetState = 'normal' | 'warning' | 'over';

/** Normal, Warning (≥ 80% do orçamento, decisão de 16/10) ou Over (passou do orçamento). */
export function budgetState(budgetCents: number, spentCents: number): BudgetState {
  if (spentCents > budgetCents) return 'over';
  // Em inteiros: gasto ≥ 80% do orçamento ⇔ 5 × gasto ≥ 4 × orçamento.
  if (budgetCents > 0 && spentCents * 5 >= budgetCents * 4) return 'warning';
  return 'normal';
}

/**
 * BudgetSummary do Onda: saldo em destaque, barra do gasto e detalhes gasto/orçamento.
 * Estados da tela 12: Warning (âmbar) a partir de 80% e Over (vermelho) quando o gasto
 * passa do orçamento; aí o destaque vira o excedente, com o rótulo "Acima do orçamento".
 */
export function BudgetSummary({ budgetCents, spentCents }: BudgetSummaryProps) {
  const { color } = useOnda();
  const state = budgetState(budgetCents, spentCents);
  const balance = budgetCents - spentCents;
  const usedPct = budgetCents > 0 ? Math.round((spentCents * 100) / budgetCents) : 0;

  const look = {
    normal: { bg: color.bg.surface, value: color.text.primary, tone: 'accent' as const },
    warning: { bg: color.bg.warningSubtle, value: color.text.warning, tone: 'warning' as const },
    over: { bg: color.bg.dangerSubtle, value: color.text.danger, tone: 'danger' as const },
  }[state];
  const label = state === 'over' ? 'Acima do orçamento' : 'Saldo disponível';
  const amount = formatBRL(Math.abs(balance));
  const message =
    state === 'warning'
      ? `Perto do limite: ${usedPct}% do orçamento usado`
      : state === 'over'
        ? 'Confira o carrinho antes de ir ao caixa.'
        : null;

  return (
    <View style={[styles.root, { backgroundColor: look.bg, borderColor: color.border.default }]}>
      <View style={styles.balance}>
        <Text style={[text.caption, { color: color.text.secondary }]}>{label}</Text>
        <Text style={[text.amount.large, { color: look.value }]} accessibilityLabel={`${label} ${amount}`}>
          {amount}
        </Text>
      </View>
      <ProgressBar
        value={budgetCents > 0 ? spentCents / budgetCents : 0}
        tone={look.tone}
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
      {message ? (
        <View style={styles.alert} accessibilityRole="alert">
          <CircleAlert color={state === 'over' ? color.icon.danger : color.text.warning} size={16} />
          <Text style={[text.caption, styles.flex, { color: look.value }]}>{message}</Text>
        </View>
      ) : null}
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
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  flex: {
    flex: 1,
  },
});
