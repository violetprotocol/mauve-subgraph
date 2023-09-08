/* eslint-disable prefer-const */
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'
import { Bundle, Pool, Token } from '../types/schema'
import { BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts'
import { exponentToBigDecimal, safeDiv } from './index'

// Optimism Goerli
const WETH_OP_GOERLI = '0x4200000000000000000000000000000000000006'
const USDC_OP_GOERLI = '0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E'
const OUT_1 = '0x32307adfFE088e383AFAa721b06436aDaBA47DBE'
const OUT_2 = '0xb378eD8647D67b5dB6fD41817fd7a0949627D87a'
// Mainnet
const WETH_MAINNET = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const USDC_MAINNET = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const EUROC = '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c'
const COINBASE_STAKED_ETH = '0xbe9895146f7af43049ca1c1ae358b0541ea49704'
const LIDO_STAKED_ETH =  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
const LIQUID_STAKED_ETH = '0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549'


const USDC_WETH_POOL = {
  'optimism-goerli': '0xD7b15F685D998A7e692b98E9A59547b7B35BC92a',
  'mainnet': '0xe45b4d18ac887ed9c221efe28b4fca230107f25f'
}

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export let WHITELIST_TOKENS: string[] = [
  // Mainnet
  WETH_MAINNET,
  USDC_MAINNET,
  COINBASE_STAKED_ETH,
  LIDO_STAKED_ETH,
  LIQUID_STAKED_ETH,
  EUROC,
  // Optimism Goerli
  OUT_1,
  OUT_2,
  USDC_OP_GOERLI,
  WETH_OP_GOERLI,
  '0x326C977E6efc84E512bB9C30f76E30c160eD06FB' // LINK
  // '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
  // '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  // '0x0000000000085d4780b73119b644ae5ecd22b376', // TUSD
  // '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
  // '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', // cDAI
  // '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
  // '0x86fadb80d8d2cff3c3680819e4da99c10232ba0f', // EBASE
  // '0x57ab1ec28d129707052df4df418d58a2d46d5f51', // sUSD
  // '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // MKR
  // '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
  // '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', // SNX
  // '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', // YFI
  // '0x111111111117dc0aa78b770fa6a738034120c302', // 1INCH
  // '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', // yCurv
  // '0x956f47f50a910163d8bf957cf5846d573e7f87ca', // FEI
  // '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', // MATIC
  // '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // AAVE
  // '0xfe2e637202056d30016725477c5da089ab0a043a', // sETH2
]

let STABLE_COINS: string[] = [
  USDC_MAINNET,
  USDC_OP_GOERLI
  // '0x6b175474e89094c44da98b954eedeac495271d0f',
  // '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  // '0xdac17f958d2ee523a2206206994597c13d831ec7',
  // '0x0000000000085d4780b73119b644ae5ecd22b376',
  // '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
  // '0x4dd28568d05f09b02220b09c2cb307bfd837cb95'
]

let MINIMUM_ETH_LOCKED = BigDecimal.fromString('60')

let Q192 = 2 ** 192
export function sqrtPriceX96ToTokenPrices(sqrtPriceX96: BigInt, token0: Token, token1: Token): BigDecimal[] {
  let num = sqrtPriceX96.times(sqrtPriceX96).toBigDecimal()
  let denom = BigDecimal.fromString(Q192.toString())
  let price1 = safeDiv(
    safeDiv(num, denom).times(exponentToBigDecimal(token0.decimals)),
    exponentToBigDecimal(token1.decimals)
  )

  let price0 = safeDiv(BigDecimal.fromString('1'), price1)
  return [price0, price1]
}

export function getEthPriceInUSD(): BigDecimal {
  const networkName = dataSource.network();
  if(!networkName) return ZERO_BD

  let usdcPoolAddress = USDC_WETH_POOL[networkName]

  if(!usdcPoolAddress) return ZERO_BD

  // fetch eth prices for each stablecoin
  let usdcPool = Pool.load(usdcPoolAddress)
  if (usdcPool !== null) {
    // token 0 is USDC
    return usdcPool.token1Price
  } else {
    return ZERO_BD
  }
}

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WETH_OP_GOERLI || token.id == WETH_MAINNET) {
    return ONE_BD
  }
  let whiteList = token.whitelistPools
  // for now just take USD from pool with greatest TVL
  // need to update this to actually detect best rate based on liquidity distribution
  let largestLiquidityETH = ZERO_BD
  let priceSoFar = ZERO_BD
  let bundle = Bundle.load('1')
  if (!bundle) return priceSoFar

  // hardcoded fix for incorrect rates
  // if whitelist includes token - get the safe price
  if (STABLE_COINS.includes(token.id)) {
    priceSoFar = safeDiv(ONE_BD, bundle.ethPriceUSD)
  } else {
    for (let i = 0; i < whiteList.length; ++i) {
      let poolAddress = whiteList[i]
      let pool = Pool.load(poolAddress)
      if (!pool) return priceSoFar

      if (pool.liquidity.gt(ZERO_BI)) {
        if (pool.token0 == token.id) {
          // whitelist token is token1
          let token1 = Token.load(pool.token1)
          if (!token1) return priceSoFar
          // get the derived ETH in pool
          let ethLocked = pool.totalValueLockedToken1.times(token1.derivedETH)
          if (ethLocked.gt(largestLiquidityETH) && ethLocked.gt(MINIMUM_ETH_LOCKED)) {
            largestLiquidityETH = ethLocked
            // token1 per our token * Eth per token1
            priceSoFar = pool.token1Price.times(token1.derivedETH as BigDecimal)
          }
        }
        if (pool.token1 == token.id) {
          let token0 = Token.load(pool.token0)
          if (!token0) return priceSoFar
          // get the derived ETH in pool
          let ethLocked = pool.totalValueLockedToken0.times(token0.derivedETH)
          if (ethLocked.gt(largestLiquidityETH) && ethLocked.gt(MINIMUM_ETH_LOCKED)) {
            largestLiquidityETH = ethLocked
            // token0 per our token * ETH per token0
            priceSoFar = pool.token0Price.times(token0.derivedETH as BigDecimal)
          }
        }
      }
    }
  }
  return priceSoFar // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedAmountUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')
  if (!bundle) return ZERO_BD
  let price0USD = token0.derivedETH.times(bundle.ethPriceUSD)
  let price1USD = token1.derivedETH.times(bundle.ethPriceUSD)

  // both are whitelist tokens, return sum of both amounts
  if (WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(price0USD).plus(tokenAmount1.times(price1USD))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST_TOKENS.includes(token0.id) && !WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(price0USD).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount1.times(price1USD).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked amount is 0
  return ZERO_BD
}
