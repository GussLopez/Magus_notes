import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  content: {
    fontSize: 12,
  },
});

interface NotePDFProps {
  title: string;
  content: string;
  noteType: string;
}

const NotePDF: React.FC<NotePDFProps> = ({ title, content, noteType }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>Type: {noteType}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
    </Page>
  </Document>
);

export default NotePDF;