// src/modules/parent/components/grades/GradeOverview.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";

import Card from "../../../../components/ui/Card/Card";

import {
  Award,
  BookOpen,
  TrendingUp,
  TrendingDown,
  GraduationCap,
} from "lucide-react";

const GradeOverview = () => {
  const {
    grades,
    parentLinks,
    selectedChild,
    selectedTerm,
  } = useSelector((state) => state.parent);

  /*
  =====================================================
  Selected Child
  =====================================================
  */

  const currentChild = useMemo(
    () =>
      parentLinks.find(
        (child) =>
          child.student === selectedChild
      ),
    [parentLinks, selectedChild]
  );

  /*
  =====================================================
  Filter Grades
  =====================================================
  */

  const filteredGrades = useMemo(() => {
    if (!currentChild) return [];

    return grades.filter(
      (item) =>
        item.student_name ===
          currentChild.student_name &&
        (selectedTerm === "All" ||
          item.exam_type === selectedTerm)
    );
  }, [
    grades,
    currentChild,
    selectedTerm,
  ]);

  /*
  =====================================================
  Statistics
  =====================================================
  */

  const stats = useMemo(() => {
    if (!filteredGrades.length) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        obtained: 0,
        total: 0,
        subjects: 0,
      };
    }

    const percentages = filteredGrades.map(
      (item) =>
        (Number(item.obtained_marks) /
          Number(item.total_marks)) *
        100
    );

    const obtained = filteredGrades.reduce(
      (sum, item) =>
        sum + Number(item.obtained_marks),
      0
    );

    const total = filteredGrades.reduce(
      (sum, item) =>
        sum + Number(item.total_marks),
      0
    );

    return {
      average: (
        obtained /
        total
      ) * 100,

      highest: Math.max(...percentages),

      lowest: Math.min(...percentages),

      obtained,

      total,

      subjects: new Set(
        filteredGrades.map(
          (item) => item.subject_name
        )
      ).size,
    };
  }, [filteredGrades]);

  /*
  =====================================================
  Cards
  =====================================================
  */

const cards = [
  {
    title: "Overall Average",
    value: `${stats.average.toFixed(2)}%`,
    icon: Award,
    iconBg: "bg-parent-primary/10",
    iconColor: "text-parent-primary",
  },
  {
    title: "Subjects",
    value: stats.subjects,
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Highest Score",
    value: `${stats.highest.toFixed(2)}%`,
    icon: TrendingUp,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Lowest Score",
    value: `${stats.lowest.toFixed(2)}%`,
    icon: TrendingDown,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "Marks",
    value: `${stats.obtained.toFixed(2)} / ${stats.total.toFixed(2)}`,
    icon: GraduationCap,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            hover={false}
            className="h-full"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {card.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-text-primary">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon
                  size={22}
                  className={card.iconColor}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default GradeOverview;