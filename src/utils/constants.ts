/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const FACTORY_ADDRESSES = {
  mainnet: '0x0569168709a869e7f4Ba142c49BFF7faA14f76C8',
  'optimism-goerli': '0xEF8894089c991CF9c009Cd66F7F2fb9dC0e2fB19'
}
export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export let factoryContracts = {
  mainnet: FactoryContract.bind(Address.fromString(FACTORY_ADDRESSES.mainnet)),
  'optimism-goerli': FactoryContract.bind(Address.fromString(FACTORY_ADDRESSES['optimism-goerli']))
}