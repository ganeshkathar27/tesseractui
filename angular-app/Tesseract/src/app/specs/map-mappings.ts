declare var require: any

export const MAP_MAPPING = {
    'INDIA_DISTRICT': {
        key: 'countries/in/in-district'
    },
    'INDIA': {
        key: 'countries/in/in-all'
    },
    'WORLD': {
        key: 'custom/world'
    },
    'CHINA': {
        key: 'countries/cn/cn-all'
    },
    'INDIA_MUMBAI': {
        key: 'countries/in/in-mumbai'
    }
}

require('../../assets/maps/mumbai.js')
require('../../assets/maps/in-district.js')
require('../../assets/maps/in-all.js')
require('../../assets/maps/china-all.js')
require('../../assets/maps/world.js')
