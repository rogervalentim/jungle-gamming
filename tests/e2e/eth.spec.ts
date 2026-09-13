import { expect, test } from '@playwright/test'
import { ethToWei, isEthAmount, multiplyEth, weiToEth } from '../../src/lib/eth'

test('soma ETH em wei sem introduzir arredondamento', () => {
  const total = ethToWei('0.1') + ethToWei('0.2')

  expect(total).toBe(300_000_000_000_000_000n)
  expect(weiToEth(total)).toBe('0.3')
})

test('preserva um wei e o limite de 12 inteiros e 18 casas decimais', () => {
  expect(ethToWei('0.000000000000000001')).toBe(1n)
  expect(weiToEth(1n)).toBe('0.000000000000000001')

  const maximum = '999999999999.999999999999999999'
  expect(isEthAmount(maximum)).toBe(true)
  expect(ethToWei(maximum)).toBe(999_999_999_999_999_999_999_999_999_999n)
  expect(weiToEth(ethToWei(maximum))).toBe(maximum)
})

test('normaliza zeros sem perder casas decimais significativas', () => {
  expect(weiToEth(0n)).toBe('0')
  expect(weiToEth(ethToWei('000001.230000000000000000'))).toBe('1.23')
  expect(weiToEth(ethToWei('2.000000000000000000'))).toBe('2')
  expect(weiToEth(ethToWei('0.000000000000000010'))).toBe('0.00000000000000001')
})

test('rejeita formatos inválidos sem arredondar ou aceitar expoentes', () => {
  const invalidAmounts = [
    '',
    ' ',
    ' 1',
    '1 ',
    '1\n',
    '1\r',
    '1\u2028',
    '-1',
    '-0',
    '+1',
    '.1',
    '1.',
    '1,5',
    '1e-18',
    '0x10',
    'NaN',
    'Infinity',
    '1000000000000',
    '0.0000000000000000001',
  ]

  for (const amount of invalidAmounts) {
    expect(isEthAmount(amount), JSON.stringify(amount)).toBe(false)
    expect(() => ethToWei(amount), JSON.stringify(amount)).toThrow(RangeError)
  }

  for (const amount of [undefined, null, 1, NaN, Infinity, 1n, {}, []]) {
    expect(isEthAmount(amount)).toBe(false)
  }
})

test('rejeita wei negativo', () => {
  expect(() => weiToEth(-1n)).toThrow(RangeError)
})

test('multiplica quantidades sem passar o valor ETH por ponto flutuante', () => {
  expect(multiplyEth('0.1', 3)).toBe('0.3')
  expect(multiplyEth('1.000000000000000001', 3)).toBe('3.000000000000000003')
  expect(multiplyEth('999999999999.999999999999999999', 0)).toBe('0')
  expect(multiplyEth('0.000000000000000001', Number.MAX_SAFE_INTEGER)).toBe(
    '0.009007199254740991',
  )
})

test('rejeita quantidade fracionária, negativa ou sem precisão segura', () => {
  for (const quantity of [
    -1,
    0.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    expect(() => multiplyEth('1', quantity)).toThrow(RangeError)
  }

  expect(() => multiplyEth('1e-18', 0)).toThrow(RangeError)
})
