import * as math from 'mathjs'

// 提供净单价
export function taxIncludedPriceWithNetPrice(netUnitPrice) {
  return math.format(math.multiply(netUnitPrice, (1+ 0.13)), { precision: 2, notation: 'fixed' })
}

export function netTotalAmountWithNetPrice(quantity, netUnitPrice) {
  return math.format(math.multiply(netUnitPrice, quantity), { precision: 2, notation: 'fixed' })
}

export function taxIncludedTotalAmountWithNetPrice(quantity, taxIncludedPrice) {
  return math.format(math.multiply(quantity, taxIncludedPrice), { precision: 2, notation: 'fixed' })
}

// 提供含税价
export function netUnitPriceWithTaxPrice(taxIncludedPrice) {
  return math.format(math.divide(taxIncludedPrice, 1.13), { precision: 2, notation: 'fixed' })
}

// 提供净总价
export function netUnitPriceWithNetTotal(netTotalAmount, quantity) {
  return math.format(math.divide(netTotalAmount, quantity), { precision: 2, notation: 'fixed' })
}

// 提供含税总价
export function taxIncludedPriceWithTaxTotal(taxIncludedTotalAmount, quantity) {
  return math.format(math.divide(taxIncludedTotalAmount, quantity), { precision: 2, notation: 'fixed' })
}

export default {
  taxIncludedPriceWithNetPrice,
  netTotalAmountWithNetPrice,
  netUnitPriceWithTaxPrice,
  taxIncludedTotalAmountWithNetPrice,
  netUnitPriceWithNetTotal,
  taxIncludedPriceWithTaxTotal
}
