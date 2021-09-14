import axios from 'axios'
import { toDataUrl } from 'ethereum-blockies'
import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { Profile } from '../../models/Profile'
import { useWeb3 } from '../../providers/Web3'
import get3BoxProfile from '../../utils/profile'
import ExplorerLink from '../atoms/ExplorerLink'
import Stats from '../pages/Profile/Stats'
import styles from './AccountTeaser.module.css'

declare type AccountTeaserProps = {
  account: string
  large: boolean
}

const Blockies = ({ account }: { account: string | undefined }) => {
  if (!account) return null
  const blockies = toDataUrl(account)

  return (
    <img
      className={styles.blockies}
      src={blockies}
      alt="Blockies"
      aria-hidden="true"
    />
  )
}

const AccountTeaser: React.FC<AccountTeaserProps> = ({ account, large }) => {
  const { networkId } = useWeb3()
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!account) return
    const source = axios.CancelToken.source()
    async function get3Box() {
      const profile = await get3BoxProfile(account, source.token)
      if (!profile) return
      setProfile(profile)
    }
    get3Box()
  }, [account])

  return (
    <article className={styles.teaser}>
      <Link to={`/account/${account}`} className={styles.link}>
        <header className={styles.header}>
          {profile?.emoji || <Blockies account={account} />}
          <div>
            <Dotdotdot className={styles.name} clamp={3}>
              {profile && <h3> {profile.name}</h3>}
            </Dotdotdot>
            <div className={styles.account}>
              <p>{account}</p>
              <ExplorerLink networkId={networkId} path={`address/${account}`} />
            </div>
          </div>
        </header>
        {large && <Stats accountId={account} />}
      </Link>
    </article>
  )
}

export default AccountTeaser