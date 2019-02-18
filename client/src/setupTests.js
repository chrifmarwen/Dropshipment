const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-16')
import 'chai/register-expect'

Enzyme.configure({ adapter: new EnzymeAdapter() })

