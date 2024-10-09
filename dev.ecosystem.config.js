module.exports = {
    apps: [
        {
            name: 'code-n-code-dev',
            script: 'npm',
            args: 'run server-dev-start',
            watch: true,
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
            'post-deploy': 'npm install && npm run build && pm2 reload dev.ecosystem.config.js --env production',
        },
        deployment: {
            user: 'root',
            host: 'dev.codencode.ae',
            ref: 'origin/suhaib-updates',
            repo: 'git@github.com:code-n-code-it-solutions/flaxen_erp.git',
            path: '/home/codencode-dev-erp/htdocs/dev.codencode.ae',
            'ssh_options': 'StrictHostKeyChecking=no',
            'post-deploy': 'npm install && npm run build && pm2 reload dev.ecosystem.config.js --env deployment',
        },
    },
};
