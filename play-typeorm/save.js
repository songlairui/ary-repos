const { Repo, RepoRemote, DeployLocation } = require('../dist/repos/repos.entity')

const { getRepository, getManager } = require("typeorm");

async function main() {
    const connection = await require('./before')([Repo, RepoRemote, DeployLocation])


    const deploylocation1 = new DeployLocation({
        device: 'nuc2',
        os: 'win',
        dirpath: 'd:/repo-local/a',
        description: 'ddd'
    })
    console.info('save2')
    await connection.getRepository(DeployLocation).save(deploylocation1)


    const repo = new Repo({
        name: '~1234',
        description: '测试2',
        deploylocations: [deploylocation1]
    })

    console.info('save1')
    await connection.getRepository(Repo).save(repo)

    const repoRemote = new RepoRemote({
        repo,
        name: 'origin2',
        fetch: 'baidu2',
        push: 'bytedance2'
    })

    await connection.getRepository(RepoRemote).save(repoRemote)
    console.info('save0', repoRemote)


    await connection.close()
}

main()