module.exports = {
    apps: [
        {
            name: 'code-n-code-dev',
            script: 'npm',
            args: 'run server-dev-start',
            watch: true,
            env: {
                NODE_ENV: 'development',
            },
            env_development: {
                NODE_ENV: 'development',
            },
        },
    ],

    deploy: {
        production: {
            user: 'root',
            host: 'dev.codencode.ae',
            ref: 'origin/suhaib-updates',
            repo: 'git@github.com:code-n-code-it-solutions/flaxen_erp.git',
            path: '/home/codencode-dev-erp/htdocs/dev.codencode.ae',
            'ssh_options': 'StrictHostKeyChecking=no',
            'post-deploy': 'npm install && npm run build && pm2 reload dev.ecosystem.config.js --env development',
            env: {
                NODE_ENV: 'development',
            },
        },
        deployment: { // Add this section
            user: 'root',
            host: 'dev.codencode.ae',
            ref: 'origin/suhaib-updates',
            repo: 'git@github.com:code-n-code-it-solutions/flaxen_erp.git',
            path: '/home/codencode-dev-erp/htdocs/dev.codencode.ae',
            'ssh_options': 'StrictHostKeyChecking=no',
            'post-deploy': 'npm install && npm run build && pm2 reload dev.ecosystem.config.js --env development',
            env: {
                NODE_ENV: 'development',
            },
        },
    },
};
