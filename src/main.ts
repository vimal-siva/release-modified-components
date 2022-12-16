import {
  debug,
  endGroup,
  error,
  getInput,
  info,
  setFailed,
  setOutput,
  startGroup
} from '@actions/core'
import {env} from 'process'
import {getFilesModifiedFromPreviousRelease} from './github.service'
import minimatch from 'minimatch'
import {readFileSync} from 'fs'

interface ComponentMetadata {
  component: string
  workflowName: string
  pathPattern: string[]
  excludePathPattern: string[]
  waitForDeployCompletion: boolean
}

async function getComponents(): Promise<Record<string, ComponentMetadata>> {
  const componentsFile = getInput('components-json', {
    required: true,
    trimWhitespace: true
  })
  const contents = readFileSync(componentsFile, 'utf8')
  return JSON.parse(contents)
}

async function run(): Promise<void> {
  try {
    const differences = await getFilesModifiedFromPreviousRelease(env)
    debug(`Files modified :: \n ${differences.join('\n')}`)

    const components = await getComponents()

    const modifiedComponents = Object.entries(components).reduce(
      (filtered, [component, metadata]) => {
        let componentDifferences = metadata.pathPattern.reduce(
          (result, pattern) => {
            result.push(...minimatch.match(differences, pattern))
            return result
          },
          [] as string[]
        )
        componentDifferences = (metadata.excludePathPattern ?? []).reduce(
          (result, pattern) => {
            const differencesToBeExcluded = minimatch.match(result, pattern)
            return result.filter(_ => !differencesToBeExcluded.includes(_))
          },
          componentDifferences
        )

        if (componentDifferences.length > 0)
          filtered.push({...metadata, component})
        return filtered
      },
      [] as ComponentMetadata[]
    )

    startGroup('Components modified')
    info(modifiedComponents.map(_ => _.component).join('\n'))
    endGroup()
    setOutput('components-matrix', modifiedComponents)
  } catch (exception: any) {
    error(exception.message)
    setFailed(exception.message)
  }
}

run()
