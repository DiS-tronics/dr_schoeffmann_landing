import { makePage } from '@keystatic/next/ui/pages'
import config from '../../keystatic.config'

const KeystaticPage = makePage(config)

// Opt out of the default layout (Nav + Footer) so Keystatic's full-screen
// admin UI can scroll and render correctly without interference.
KeystaticPage.getLayout = (page) => page

export default KeystaticPage
