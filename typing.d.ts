interface Plugin {
    book?: {
        assets?: string[]
        css?: string[]
        js?: string[]
    }
    hooks?: {
        page(page: Page): Page
    },
    options: {
        pluginsConfig: ConfigMap
    }
    config: {
        get(name: string): Config
        values: {
            pluginsConfig: ConfigMap
            title: string
            language: string
            author: string
        }
    }
    log: Console
}

interface Page {
    title: string
    content: string
    path: string
    rawPath: string
    type: PageType
}

interface Config {
    header?: HtmlEntity
    footer?: HtmlEntity
}

type ConfigMap = { [name: string]: Config }

interface HtmlEntity {
    files?: string[]
    modules?: Module
}

interface Module {
    donate?: DonateModule | true
    divider?: DividerModule | true
}

interface DonateModule extends BaseModule<"DonateModule"> {
    buttonText: string
    buttonRadius: number | string
    description: string
    qrCodes: QrCode[]
}

interface CopyrightModule extends BaseModule<"CopyrightModule"> {
    showLine?: boolean
    content: string
}

interface BaseModule<T> {
    name?: T
}

interface DividerModule extends BaseModule<"DividerModule"> {
    type?: "dashed" | "solid"
}


interface QrCode {
    image: string
    label: string
}

type PageType = "markdown" | "asciidoc"