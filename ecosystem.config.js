module.exports = {
    apps: [
        {
            name: 'code-n-code',
            script: 'npm',
            args: 'start',
            watch: true,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
    deploy: {
        production: {
            user: 'root', // e.g., 'root'
            host: 'erp.codencode.ae', // e.g., '123.45.67.89'
            ref: 'origin/master', // Branch to pull
            repo: 'git@github.com:code-n-code-it-solutions/flaxen_erp.git', // Git repo
            path: '/home/codencode-erp/htdocs/erp.codencode.ae',
            'post-deploy':
                'npm install && npm run build && pm2 reload ecosystem.config.js --env production',

        },
    },
};
