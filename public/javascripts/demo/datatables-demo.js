// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#tabel').DataTable({
    responsive: true,
    lengthMenu: [[3, 10, 100], [3, 10, 100]],
    ajax: "/dashboard/data",
    columns: [
      { data: "month" },
      { data: "expense", searchable: false },
      { data: "revenue", searchable: false },
      { data: "earning", searchable: false }
    ]
  });
});
