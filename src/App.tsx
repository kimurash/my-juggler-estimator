import { useEffect, useState } from 'react';
import './App.css';
import BalanceCalculator from './components/BalanceCalculator';
import NominalTable from './components/NominalTable';
import RecordManager from './components/RecordManager';
import { Estimation, NominalType, ResultType, SlotRecord } from './Types';

const nominalValue: Record<NominalType, number>[] = [
  { // 設定1
    big: 1/273.1,
    regSingle: 1/655.36,
    regWithCherry: 1/1092.27,
    totalBonus: 1/163.8,
    grape: 1/5.9
  },
  { // 設定2
    big: 1/270.8,
    regSingle: 1/595.78,
    regWithCherry: 1/1092.27,
    totalBonus: 1/159.1,
    grape: 1/5.85
  },
  { // 設定3
    big: 1/266.4,
    regSingle: 1/494.68,
    regWithCherry: 1/1040.25,
    totalBonus: 1/148.6,
    grape: 1/5.8
  },
  { // 設定4
    big: 1/254,
    regSingle: 1/404.54,
    regWithCherry: 1/1024,
    totalBonus: 1/135.4,
    grape: 1/5.78
  },
  { // 設定5
    big: 1/240.1,
    regSingle: 1/390.1,
    regWithCherry: 1/862.32,
    totalBonus: 1/126.8,
    grape: 1/5.76
  },
  { // 設定6
    big: 1/229.1,
    regSingle: 1/327.68,
    regWithCherry: 1/762.05,
    totalBonus: 1/114.6,
    grape: 1/5.66
  },
]

const initialState = new Map<ResultType, SlotRecord>([
  [
    'big', {
      title: 'BIG',
      count: 0,
      likelihood: 0
    }
  ],
  [
    'regSingle', {
      title: '単独REG',
      count: 0,
      likelihood: 0
    }
  ],
  [
    'regWithCherry', {
      title: 'チェリー重複REG',
      count: 0,
      likelihood: 0
    }
  ],
  [
    'grape', {
      title: 'ぶどう',
      count: 0,
      likelihood: 0
    }
  ],
  [
    'lose', {
      title: 'はずれ',
      count: 0,
      likelihood: 0
    }
  ],
])

function App() {
  const [record, setRecord] = useState<Map<ResultType, SlotRecord>>(initialState)
  const [estimation, setEstimation] = useState<Estimation>(-1)

  // カウント値の更新をトリガとして推定結果を更新
  useEffect(() => {
    // console.log('useEffect')

    // 確信度の最小値
    let minConfidence = Number.MAX_SAFE_INTEGER

    for(const [idx, setting] of nominalValue.entries()){
      let confidence = calcConfidence(setting)

      // 合算確率の差の絶対値を加算
      const combined = calcCombinedBonus()
      confidence += Math.abs(setting.totalBonus - combined)

      if(confidence < minConfidence){
        minConfidence = confidence
        setEstimation(idx + 1 as Estimation)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])

  // 確信度を計算する関数
  const calcConfidence = (setting: Record<NominalType, number>) => {
    let confidence = 0

    for(const [key, value] of Object.entries(setting)){
      const result = record.get(key as NominalType)
      if(!result){
        // ボーナス合算は記録に含まれていない
        continue
      }
      confidence += Math.abs(result.likelihood - value)
    }

    return(confidence)
  }

  // 合算確率を求める関数
  const calcCombinedBonus = () => {
    let bonusCount = 0
    let sumCount = 0

    record.forEach((value, key) => {
      sumCount += value.count

      if(key === 'big' || key === 'regSingle' || key === 'regWithCherry'){
        bonusCount += value.count
      }
    })

    if(sumCount === 0){
      return(0)
    } else{
      return(bonusCount / sumCount)
    }
  }

  // RecordManagerタグの配列を返す関数
  const listManager = (): JSX.Element[] => {
    const list = []

    for(const key of initialState.keys()){
      list.push(
        <RecordManager
          key={key}
          mapkey={key}
          record={record}
          setRecord={setRecord}
        />
      )
    }

    return(list)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>マイジャグラー5 設定推定</h2>
      </header>
      <div className='control-panel'>
        { listManager() }
      </div>
      <div>
        <h3>
          推定結果: <span className='estimation'>{
            estimation === -1 ? 'カウントしてください' : `設定${estimation}`
          }</span>
        </h3>
      </div>
      <div>
        <NominalTable nominalValue={nominalValue} />
      </div>
      <hr />
      <h2 style={{margin: '5px'}}>収支計算</h2>
      <BalanceCalculator />
    </div>
  );
}

export default App;
