import mustAuthenticate from 'api/lib/enforce-session'
import staticConfig from 'lib/config'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import {
  sendEmail,
} from 'api/email/mailer'

const createSendEmail = async ({email, displayname,}) => {
  const config = await staticConfig()
  const token = jwt.sign({
    email,
  }, config.get('keypair.clientprivate'), {
    'expiresIn': '1d',
    'issuer':    config.get('domain'),
    'algorithm': 'HS256',
  })
  let link = `https://${config.get('domain')}/account/verify-email/${token}`

  if (process.env.NODE_ENV === 'development') {
    link = `http://${config.get('domain')}/account/verify-email/${token}`
  }

  const expires = moment().add(1, 'days').format('MMMM Do, HH:mm ZZ')

  const result = await sendEmail({
    'to':       email,
    'template': 'email-verification-request',
    'locals':   {
      displayname,
      link,
      expires,
    },
  })

  return result
}

export default {
  'name': 'resendVerification',

  async resolver (root, options, {Session, token,}) {
    const session = await mustAuthenticate(token, Session)

    if (session.user.emailVerified) {
      throw new Error('email-already-verified')
    }

    const result = await createSendEmail(session.user)

    if (!result.accepted) {
      throw new Error('email-not-accepted')
    }

    if (result.accepted[0] !== session.user.email) {
      throw new Error(result.accepted)
    }

    return true
  },
}
