import React, { useState } from "react"
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

  const handleBalance = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="amount-form">
        <h3>収入</h3>
        <input
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
        <p className={`error-msg ${errors.income && 'on-error'}`}>
          { errors.income ? errors.income.message : 'エラーメッセージ' }
        </p>
      </div>
      <div className="formula-symbol">－</div>
      <div className="amount-form">
        <h3>投資金額</h3>
        <input
          type="text"
          placeholder="投資金額を入力してください"
          {...register('invest', {
            pattern: {
              value: /^[0-9]+$/,
              message: '半角数字を入力してください'
            },
            onChange: (event) => { handleBalance(event) }
          })}
        />
        <p className={`error-msg ${errors.invest && 'on-error'}`}>
          { errors.invest ? errors.invest.message : 'エラーメッセージ' }
        </p>
      </div>
      <div className="formula-symbol">=</div>
      <div className="amount-form benefit-zone">
        <h3>利益</h3>
        <div className="benefit">{ balance.benefit }</div>
      </div>
    </div>
  )
}

export default BalanceCalculator
