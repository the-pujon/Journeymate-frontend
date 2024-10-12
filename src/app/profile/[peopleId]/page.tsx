import React from 'react';

const PeopleDetailsPage = ({ params }: { params: { peopleId: string } }) => {
    const { peopleId } = params;
    console.log(peopleId)
    return (
        <div>

        </div>
    );
};

export default PeopleDetailsPage;