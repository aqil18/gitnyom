import React from 'react';
import CliTextViewer from './CLITextViewer';

const Security: React.FC = () => {
    return (
        <div>
            <CliTextViewer fileName="basic_output.txt" fileUrl="basic_output.txt" />
            <div className="my-4">
                <CliTextViewer fileName="basic_output2.txt" fileUrl="basic_output2.txt" />
            </div>
            <CliTextViewer fileName="basic_output3.txt" fileUrl="basic_output3.txt" />
        </div>
    );
};

export default Security;