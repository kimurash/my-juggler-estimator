import React, { useState, ChangeEvent } from "react"
import { useForm } from "react-hook-form"

// ユーザが入力する値
type AmountForm = {
  income: string,
  invest: string
}

// 状態管理対象の値
type Balance = {
  income: number,
  invest: number,
  benefit: number
}

const BalanceCalculator: React.FC = () => {
  const [balance, setBalance] = useState<Balance>({
    income: 0,
    invest: 0,
    benefit: 0
  })

  const handleBalance = (event: ChangeEvent<HTMLInputElement>) => {
    setBalance((prevState) => {
      const targetValue = Number(event.target.value)
      if(isNaN(targetValue)){
        // HACK: バリデーションの重複
        return(prevState)
      }

      switch(event.target.name){
        case 'income':
          return({
            ...prevState,
            income: targetValue,
            benefit: targetValue - prevState.invest
          })
        case 'invest':
          return({
            ...prevState,
            invest: targetValue,
            benefit: prevState.income - targetValue
          })
        default:
          return(prevState)
      }
    })
  }

  const { register, formState: { errors } } = useForm<AmountForm>({
    mode: 'onChange' // 値が変更された時にバリデーション
  })

  return(
    <div className="calculator">
      <div className="calc-container">

        <h3 className="income-title amount-name">収入</h3>
        <input
          className="income-ammount amount-form"
          type="text"
          placeholder="収入を入力してください"
          {...register('income', {
            pattern: {
              value: /^[0-9]+$/,
              message: '半角数字を入力してください'
            },
            onChange: (event) => { handleBalance(event) }
          })}
        />
        
        <h3 className="invest-title amount-name">投資額</h3>
        <input
          className="invest-ammount amount-form"
          type="text"
          placeholder="投資額を入力してください"
          {...register('invest', {
            pattern: {
              value: /^[0-9]+$/,
              message: '半角数字を入力してください'
            },
            onChange: (event) => { handleBalance(event) }
          })}
        />

        <h3 className="benefit-title amount-name">利益</h3>
        <div className="benefit-amount benefit-zone">
          { balance.benefit }
        </div>
  
        <p className={`error-msg ${(errors.income || errors.invest) && 'on-error'}`}>
          { errors.income ? errors.income.message : (
            errors.invest ? errors.invest.message : '')
          }
        </p>
      </div>
    </div>
  )
}

export default BalanceCalculator
