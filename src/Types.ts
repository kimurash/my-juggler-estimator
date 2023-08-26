// コンポーネントで管理する情報
export type SlotRecord = {
  title: string,
  count: number,
  likelihood: number
}

// 記録対象のゲーム結果
export type ResultType =
| 'big'
| 'regSingle'
| 'regWithCherry'
| 'totalBonus'
| 'grape'
| 'lose'

// 公称値に'はずれ'は含まれない
export type NominalType = Exclude<ResultType, 'lose'>

// 推定結果
export type Estimation = -1 | 1 | 2 | 3 | 4 | 5 | 6
