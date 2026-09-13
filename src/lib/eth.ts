const WEI_PER_ETH = 10n ** 18n
const ETH_AMOUNT_PATTERN = /^[0-9]{1,12}(?:\.[0-9]{1,18})?$/

export function isEthAmount(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim() === value &&
    ETH_AMOUNT_PATTERN.test(value)
  )
}

export function ethToWei(value: string): bigint {
  if (!isEthAmount(value)) {
    throw new RangeError(
      'ETH deve ser um decimal não negativo com até 18 casas.',
    )
  }

  const [whole, fraction = ''] = value.split('.')
  return BigInt(whole) * WEI_PER_ETH + BigInt(fraction.padEnd(18, '0'))
}

export function weiToEth(value: bigint): string {
  if (value < 0n) {
    throw new RangeError('Wei não pode ser negativo.')
  }

  const whole = value / WEI_PER_ETH
  const fraction = (value % WEI_PER_ETH)
    .toString()
    .padStart(18, '0')
    .replace(/0+$/, '')

  return fraction ? `${whole}.${fraction}` : whole.toString()
}

export function multiplyEth(amount: string, quantity: number): string {
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new RangeError(
      'A quantidade deve ser um inteiro seguro não negativo.',
    )
  }

  return weiToEth(ethToWei(amount) * BigInt(quantity))
}
