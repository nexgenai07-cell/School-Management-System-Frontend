// src/modules/parent/components/events/EventsHeader.jsx

import {

} from "lucide-react";

import PageHeader from "../../../../components/global/PageHeader/PageHeader";


const EventsHeader = () => {
  return (
    <PageHeader
      title="Events & Activities"
      subtitle="Discover upcoming school events and track your participation history."
      breadcrumbs={[
        "Parent",
        "Events",
      ]}
     
    />
  );
};

export default EventsHeader;