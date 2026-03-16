import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { ALL_ROUTES } from "@/config/Transactionroutes";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: "#333", fontFamily: "Helvetica" },
  // Header section
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#111",
    paddingBottom: 10,
  },
  appName: { fontSize: 20, fontWeight: "bold", color: "#111", marginBottom: 4 },
  metaData: {
    fontSize: 9,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Content section
  section: { marginTop: 20 },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 4,
  },
  label: { width: 130, color: "#555", fontSize: 9, fontWeight: "bold" },
  value: { flex: 1, color: "#000" },

  // Description
  descSection: { marginTop: 15, padding: 10, backgroundColor: "#f9f9f9" },

  // Footer Amount
  amountBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#111",
    borderRadius: 4,
    textAlign: "right",
  },
  totalLabel: { fontSize: 8, color: "#ccc", marginBottom: 2 },
  totalAmount: { fontSize: 18, fontWeight: "bold", color: "#fff" },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#999",
    fontSize: 8,
  },
});

interface PDFProps {
  transaction: any;
  appName: string;
}

export default function TransactionPDF({ transaction, appName }: PDFProps) {
  const route = ALL_ROUTES.find((r) => r.category === transaction.category);
  const categoryLabel = route?.label || "General Transaction";
  const typeLabel = transaction.type; // 'income' or 'expense'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Header with App Name and Metadata */}
        <View style={styles.header}>
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.metaData}>|{categoryLabel}</Text>
        </View>

        <View style={styles.section}>
          {/* Basic Information - Always Present */}
          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.value}>{transaction._id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>{transaction.paymentMethod}</Text>
          </View>

          {/* --- CASE: CLIENT PAYMENT --- */}
          {transaction.category === "client_payment" && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Client Name:</Text>
                <Text style={styles.value}>
                  {transaction.client?.name || "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Project Name:</Text>
                <Text style={styles.value}>
                  {transaction.project?.name || "N/A"}
                </Text>
              </View>
            </>
          )}

          {/* --- CASE: EMPLOYEE SALARY --- */}
          {transaction.category === "employee_salary" && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Employee Name:</Text>
                <Text style={styles.value}>
                  {transaction.employee?.user?.name || "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Employment Type:</Text>
                <Text style={styles.value}>
                  {transaction.employee?.employmentType || "N/A"}
                </Text>
              </View>
            </>
          )}

          {/* --- CASE: EMPLOYEE PAYMENT --- */}
          {transaction.category === "employee_payment" && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Employee Name:</Text>
                <Text style={styles.value}>
                  {transaction.employee?.user?.name || "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Project Name:</Text>
                <Text style={styles.value}>
                  {transaction.project?.name || "N/A"}
                </Text>
              </View>
            </>
          )}

          {/* --- CASE: EMPLOYEE BONUS --- */}
          {transaction.category === "employee_bonus" && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Employee Name:</Text>
                <Text style={styles.value}>
                  {transaction.employee?.user?.name || "N/A"}
                </Text>
              </View>
              {transaction.project?.name && (
                <View style={styles.row}>
                  <Text style={styles.label}>Project Name:</Text>
                  <Text style={styles.value}>{transaction.project.name}</Text>
                </View>
              )}
            </>
          )}

          {/* Status */}
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{transaction.status}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.descSection}>
          <Text style={{ fontSize: 8, color: "#777", marginBottom: 4 }}>
            DESCRIPTION
          </Text>
          <Text style={{ lineHeight: 1.5 }}>
            {transaction.description || "No description provided."}
          </Text>
        </View>

        {/* Amount Box */}
        <View style={styles.amountBox}>
          <Text style={styles.totalLabel}>
            TOTAL AMOUNT ({transaction.currency})
          </Text>
          <Text style={styles.totalAmount}>
            {transaction.amount?.toLocaleString()} {transaction.currency}
          </Text>
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleString()} | Added by:{" "}
          {transaction.addedBy?.name}
        </Text>
      </Page>
    </Document>
  );
}
