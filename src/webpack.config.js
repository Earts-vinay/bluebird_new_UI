import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export const plugins = [
    // other plugins...
    new CopyWebpackPlugin({
        patterns: [
            {
                from: 'public', // source directory
                to: 'assets', // destination directory in the output folder
                // globOptions: {
                //     ignore: ['index.html'], // you might want to ignore index.html
                // },
            },
        ],
    }),
];