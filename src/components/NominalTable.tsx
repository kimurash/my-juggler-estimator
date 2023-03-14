import React from "react"
import { NominalType } from "../Types"

type NominalProps = {
  nominalValue: Record<NominalType, number>[]
}

const NominalTable: React.FC<NominalProps> = ({ nominalValue }) => {
  // 公称値を並べたtdタグの配列を返す関数
  const listNominalValue = (setting: Record<NominalType, number>): JSX.Element[] => {
    const list = []
    for(const [key, value] of Object.entries(setting)){
      list.push(
        <td key={key}>{value.toFixed(5)}</td>
      )
    }
    return(list)
  }

  return(
    <table>
    <tbody>
      <tr>
        <th>設定</th>
        <th>BIG</th>
        <th>単独REG</th>
        <th>チェリー重複REG</th>
        <th>ボーナス合算</th>
        <th>ぶどう</th>
      </tr>
      {
        nominalValue.map((setting, idx) => {
          return(
            <tr key={idx.toString()}>
              <td >設定{idx + 1}</td>
              {
                listNominalValue(setting)
              }
            </tr>
          )
        })
      }
    </tbody>
    </table>
  )
}

export default NominalTable
