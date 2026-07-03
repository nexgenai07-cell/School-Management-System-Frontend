// src/modules/parent/components/behaviorLogs/BehaviorHeader.jsx

import PageHeader from "../../../../components/global/PageHeader/PageHeader";

const BehaviorHeader = () => {
  return (
    <PageHeader
      title="Behavior Logs"
      subtitle="Monitor your child's behavior records, teacher observations, and disciplinary actions."
      breadcrumbs={[
        "Parent",
        "Behavior Logs",
      ]}
    />
  );
};

export default BehaviorHeader;