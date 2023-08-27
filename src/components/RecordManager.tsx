import React, {useContext} from "react";
import { SlotRecord, ResultType } from "../Types";
import { useLongPress } from "../hooks/useLongPress";
import { RecordContext } from "../App";

type Props = {
  // key属性は子コンポーネントに渡せない
  mapkey: ResultType,
}

const RecordManager: React.FC<Props> = (props) => {
  const {record, setRecord} = useContext(RecordContext)

  const countUp = () => {
    // console.log('count up')

    setRecord((prevState) => {
      let sumCount = 0
      const newRecord = new Map<ResultType, SlotRecord>()

      // カウント数の更新と合計
      prevState.forEach((value, key) => {
        if(key === props.mapkey){
          sumCount += ++value.count
        } else{
          sumCount += value.count
        }

        newRecord.set(key, value)
      })
      
      // 確率の更新
      updateLikelihood(newRecord, sumCount)
      return(newRecord)
    })
  }

  const countDown = () => {
    // console.log('count down')

    setRecord((prevState) => {
      let sumCount = 0
      const newRecord = new Map<ResultType, SlotRecord>()

      // カウント数の更新と合計
      prevState.forEach((value, key) => {
        if(key === props.mapkey && value.count > 0){
          sumCount += --value.count
        } else{
          sumCount += value.count
        }

        newRecord.set(key, value)
      })
      
      // 確率の更新
      updateLikelihood(newRecord, sumCount)
      return(newRecord)
    })
  }

  // 確率を更新する関数
  const updateLikelihood = (
    record: Map<ResultType, SlotRecord>, sumCount: number
  ) => {
    if(sumCount <= 0){ // 0除算防止
      record.forEach((value, key) => {
        record.set(key, {
          ...value, likelihood: 0
        })
      })
    } else{
      record.forEach((value, key) => {
        const updated = value.count / sumCount
        record.set(key, {
          ...value, likelihood: updated
        })
      })
    }
  }

  // ボタン長押しのイベントハンドラ
  const longCountUp = useLongPress(countUp, 100)
  const longCountDown = useLongPress(countDown, 100)

  const displayedValue = record.get(props.mapkey)

  return(
    <div className="counter">
      <h3 className="countee-title">
        {
          displayedValue ? displayedValue.title : 'Not Found'
        }
      </h3>
      <button className="btn count-up" onClick={countUp} {...longCountUp}>
        <div className="arrow up"></div>
      </button>
      <h3 className="count">
        {
          displayedValue ? displayedValue.count : 'Not Found'
        }
      </h3>
      <button className="btn count-down" onClick={countDown} {...longCountDown}>
        <div className="arrow down"></div>
      </button>
      <h3 className="likelihood">
        {
          displayedValue ? displayedValue.likelihood.toFixed(5) : 'Not Found'
        }
      </h3>
    </div>
  )
}

export default RecordManager
