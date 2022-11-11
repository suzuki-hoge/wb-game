import type {NextPage} from 'next'
import React, {useState} from "react"
import styles from './index.module.scss'

// types

type Ball = 'w' | 'b'

type Mountain = {
  ws: number
  bs: number
}

type Check = {
  ws: number[]
  bs: number[]
}

const Game: NextPage = () => {

  // functions

  const validate = (checks: Check[]): number | undefined => {
    const is = checks.flatMap((check, i) => {
      return check.ws.length !== 0 || check.bs.length !== 0 ? [i] : []
    })

    if (is.length !== 1) {
      return undefined
    }

    const i = is[0]

    if (checks[i].ws.length !== 0 && checks[i].bs.length !== 0) {
      return undefined
    }

    return 1 === checks[i].ws.length || 1 <= checks[i].bs.length && checks[i].bs.length <= mountains[i].bs / 2 ? i : undefined
  }
  const check = (i: number, j: number, b: Ball) => {
    const cs = [...checks]
    if (b === 'w') {
      cs[i] = {ws: cs[i].ws.includes(j) ? cs[i].ws.filter(n => n != j) : [...cs[i].ws, j], bs: cs[i].bs}
    } else {
      cs[i] = {ws: cs[i].ws, bs: cs[i].bs.includes(j) ? cs[i].bs.filter(n => n != j) : [...cs[i].bs, j]}
    }
    setChecks(cs)
    setValid(validate(cs) !== undefined)
  }
  const fix = () => {
    const i = validate(checks)
    if (i === undefined) {
      return
    }
    setPlayer((player) % 2 + 1)
    setValid(false)

    const ms = [...mountains]
    if (checks[i].ws.length !== 0) {
      ms[i].ws -= checks[i].ws.length
    }
    if (checks[i].bs.length !== 0) {
      ms[i].bs -= checks[i].bs.length
    }
    setMountains(ms)
    setChecks(mkChecks(ms))
  }
  const mkChecks = (ms: Mountain[]): Check[] => {
    return ms.map(() => ({ws: [], bs: []}))
  }
  const mkMountains = (s: string): Mountain[] => {
    try {
      const n = parseInt(s.split("\n")[0])
      const ws = s.split("\n")[1].split(' ').map(s => parseInt(s))
      const bs = s.split("\n")[2].split(' ').map(s => parseInt(s))
      return [...Array(n)].map((_, i) => ({ws: ws[i], bs: bs[i]}))
    } catch (e) {
      return []
    }
  }
  const changeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const _ms = mkMountains(e.target.value)
    setMountains(_ms)
    setChecks(mkChecks(_ms))
  }

  // vars

  const _input = '6\n3 1 4 1 5 9\n2 7 1 8 2 8'
  const _ms = mkMountains(_input)
  const [player, setPlayer] = useState(1)
  const [valid, setValid] = useState(false)
  const [input, setInput] = useState(_input)
  const [mountains, setMountains] = useState<Mountain[]>(_ms)
  const [checks, setChecks] = useState<Check[]>(mkChecks(_ms))

  // view

  return (
    <div className={styles.game}>
      <div className={styles.mountains}>
        {mountains.map((m, i) => <div key={i} className={styles.mountain}>
          {[...Array(m.ws)].map((_, j) => <div key={j} className={styles.white} onClick={() => check(i, j, 'w')}>
            {checks[i].ws.includes(j) ? 'x' : ''}
          </div>)}
          {[...Array(m.bs)].map((_, j) => <div key={j} className={styles.blue} onClick={() => check(i, j, 'b')}>
            {checks[i].bs.includes(j) ? 'x' : ''}
          </div>)}
        </div>)}
      </div>
      <div className={styles.play}>
        <div className={styles.tern}>Player: {player}</div>
        <button className={styles.fix} onClick={() => fix()} disabled={!valid}>Fix</button>
      </div>
      <textarea value={input} rows={5} placeholder="input" onChange={changeInput}></textarea>
    </div>
  )
}

export default Game
